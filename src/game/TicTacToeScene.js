
import Phaser from "phaser";

import {
    findBestMove,
    getWinner,
    isDraw
} from "../ai/minimax.js";

export default class TicTacToeScene extends Phaser.Scene {
    constructor() {
        super("TicTacToeScene");

        this.human = "X";
        this.ai = "O";

        this.board = Array(9).fill(null);

        this.gameOver = false;
        this.isThinking = false;

        this.scores = {
            human: 0,
            ai: 0,
            draws: 0
        };

        this.status = "Your turn — choose a cell";
        this.winningLine = null;
    }

    create() {
        this.drawGame();
    }

    drawGame() {
        // Remove previous board objects before redrawing.
        this.children.removeAll(true);

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor("#11182B");

        this.add.text(width / 2, 35, "TIC TAC TOE", {
            fontFamily: "Arial, sans-serif",
            fontSize: "30px",
            fontStyle: "bold",
            color: "#F4F6FF"
        }).setOrigin(0.5);

        this.add.text(width / 2, 70, "MINIMAX AI", {
            fontFamily: "Arial, sans-serif",
            fontSize: "13px",
            color: "#8BA5FF",
            letterSpacing: 4
        }).setOrigin(0.5);

        this.add.text(width / 2, 108, this.status, {
            fontFamily: "Arial, sans-serif",
            fontSize: "17px",
            color: this.gameOver ? "#75E0B0" : "#D5DDF5",
            align: "center",
            wordWrap: { width: 500 }
        }).setOrigin(0.5);

        this.drawScoreboard(width);

        const cellSize = 140;
        const boardSize = cellSize * 3;
        const startX = (width - boardSize) / 2;
        const startY = 205;

        // Draw the board.
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const index = row * 3 + col;

                const x = startX + col * cellSize;
                const y = startY + row * cellSize;

                const isWinningCell =
                    this.winningLine?.includes(index);

                const cell = this.add.rectangle(
                    x + cellSize / 2,
                    y + cellSize / 2,
                    cellSize - 8,
                    cellSize - 8,
                    isWinningCell ? 0x244D4A : 0x202B46
                );

                cell.setStrokeStyle(
                    isWinningCell ? 3 : 1,
                    isWinningCell ? 0x75E0B0 : 0x394765
                );

                if (
                    this.board[index] === null &&
                    !this.gameOver &&
                    !this.isThinking
                ) {
                    cell.setInteractive({ useHandCursor: true });

                    cell.on("pointerover", () => {
                        cell.setFillStyle(0x2C3A5C);
                    });

                    cell.on("pointerout", () => {
                        cell.setFillStyle(
                            isWinningCell ? 0x244D4A : 0x202B46
                        );
                    });

                    cell.on("pointerdown", () => {
                        this.handleHumanMove(index);
                    });
                }

                const mark = this.board[index];

                if (mark !== null) {
                    this.add.text(
                        x + cellSize / 2,
                        y + cellSize / 2,
                        mark,
                        {
                            fontFamily: "Arial, sans-serif",
                            fontSize: "76px",
                            fontStyle: "bold",
                            color: mark === "X"
                                ? "#73A7FF"
                                : "#FF9C91"
                        }
                    ).setOrigin(0.5);
                }
            }
        }

        // New round button.
        this.createButton(
            width / 2 - 95,
            height - 43,
            "NEW ROUND",
            () => this.resetRound(),
            150
        );

        // Reset scores button.
        this.createButton(
            width / 2 + 95,
            height - 43,
            "RESET SCORES",
            () => this.resetScores(),
            170
        );
    }

    drawScoreboard(width) {
        const y = 155;

        const scoreItems = [
            {
                x: width / 2 - 150,
                title: "YOU (X)",
                value: this.scores.human,
                color: "#73A7FF"
            },
            {
                x: width / 2,
                title: "AI (O)",
                value: this.scores.ai,
                color: "#FF9C91"
            },
            {
                x: width / 2 + 150,
                title: "DRAWS",
                value: this.scores.draws,
                color: "#C6D0E8"
            }
        ];

        for (const item of scoreItems) {
            this.add.text(item.x, y, item.title, {
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                color: item.color,
                fontStyle: "bold"
            }).setOrigin(0.5);

            this.add.text(
                item.x,
                y + 22,
                String(item.value),
                {
                    fontFamily: "Arial, sans-serif",
                    fontSize: "20px",
                    color: "#FFFFFF",
                    fontStyle: "bold"
                }
            ).setOrigin(0.5);
        }
    }

    createButton(x, y, label, callback, buttonWidth) {
        const button = this.add.rectangle(
            x,
            y,
            buttonWidth,
            42,
            0x2A3755
        );

        button.setStrokeStyle(1, 0x53658B);
        button.setInteractive({ useHandCursor: true });

        const text = this.add.text(x, y, label, {
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            fontStyle: "bold",
            color: "#F4F6FF"
        }).setOrigin(0.5);

        button.on("pointerover", () => {
            button.setFillStyle(0x3B4E76);
        });

        button.on("pointerout", () => {
            button.setFillStyle(0x2A3755);
        });

        button.on("pointerdown", callback);

        // Keep text above the button.
        text.setDepth(1);
    }

    handleHumanMove(index) {
        if (
            this.gameOver ||
            this.isThinking ||
            this.board[index] !== null
        ) {
            return;
        }

        // Human plays X.
        this.board[index] = this.human;

        if (this.finishIfGameOver()) {
            return;
        }

        this.isThinking = true;
        this.status = "AI is thinking...";
        this.drawGame();

        // Short delay so the AI response feels natural.
        this.time.delayedCall(300, () => {
            this.handleAIMove();
        });
    }

    handleAIMove() {
        if (this.gameOver) {
            this.isThinking = false;
            return;
        }

        const move = findBestMove(
            this.board,
            this.ai,
            this.human
        );

        if (move !== -1) {
            this.board[move] = this.ai;
        }

        this.isThinking = false;

        if (this.finishIfGameOver()) {
            return;
        }

        this.status = "Your turn — choose a cell";
        this.drawGame();
    }

    finishIfGameOver() {
        const winner = getWinner(this.board);

        if (winner !== null) {
            this.gameOver = true;

            if (winner === this.human) {
                this.scores.human++;
                this.status = "You won! (Unexpected AI failure)";
            } else {
                this.scores.ai++;
                this.status = "AI wins! Try again.";
            }

            this.winningLine = this.getWinningLine(winner);
            this.drawGame();

            return true;
        }

        if (isDraw(this.board)) {
            this.gameOver = true;
            this.scores.draws++;
            this.status = "It's a draw! Great defence.";
            this.drawGame();

            return true;
        }

        return false;
    }

    getWinningLine(winner) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return lines.find(line =>
            line.every(index => this.board[index] === winner)
        ) ?? null;
    }

    resetRound() {
        this.board = Array(9).fill(null);
        this.gameOver = false;
        this.isThinking = false;
        this.winningLine = null;
        this.status = "Your turn — choose a cell";

        this.drawGame();
    }

    resetScores() {
        this.scores = {
            human: 0,
            ai: 0,
            draws: 0
        };

        this.resetRound();
    }
}
