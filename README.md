# Tic Tac Toe AI

A Tic Tac Toe project with two ways to play:

- A browser game built with Phaser 3 and Vite. You play as **X** against an **O** AI.
- A separate Python terminal game. You play as **O** against an **X** computer.

Both computer opponents use the Minimax algorithm to choose moves. In the browser game, alpha-beta pruning reduces the number of game states the search needs to examine.

## Contents

- [Requirements](#requirements)
- [Browser game](#browser-game)
- [Python terminal game](#python-terminal-game)
- [How the AI works](#how-the-ai-works)
- [Project structure](#project-structure)
- [Rules](#rules)

## Requirements

For the browser game:

- Node.js and npm
- A modern web browser

For the optional terminal game:

- Python 3

## Browser game

From the project directory, install the JavaScript dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed in the terminal. Select an empty square to play as **X**. The AI responds as **O**.

The game displays scores for you, the AI, and draws:

- **New Round** clears the board and keeps the scores.
- **Reset Scores** clears the board and resets all scores.

To create a production build:

```bash
npm run build
```

Vite writes the build output to `dist/`. To serve that build locally:

```bash
npm run preview
```

## Python terminal game

The Python version is independent of the browser game and does not require npm. Run it from the project directory:

```bash
python tictactoe.py
```

On some systems, use `python3` instead:

```bash
python3 tictactoe.py
```

Enter a row and column when prompted. Both coordinates are zero-based, so each must be between `0` and `2`. You play as **O**; the computer plays as **X**.

The Python program prints the score it evaluates for each available computer move before selecting the best one. It also generates a complete game tree at startup; this tree is separate from the recursive Minimax search used to choose a move.

## How the AI works

### Minimax

Tic Tac Toe has a small, finite set of possible moves. Minimax searches possible continuations of the current board and assumes that both players choose the best move available to them:

1. The computer considers each legal move.
2. It explores the resulting board states, alternating between computer and human turns.
3. It scores terminal states: a computer win is positive, a human win is negative, and a draw is zero.
4. On the computer's turn, it chooses the highest-scoring continuation. On the human's turn, the search assumes the human chooses the lowest-scoring continuation.

This is why playing optimally against the browser AI should result in a draw at best for the human; the AI can take a win if one is available.

### Browser search and alpha-beta pruning

The browser implementation is in `src/ai/minimax.js`. It searches with alpha-beta pruning, which skips branches that cannot improve the result already found. It tries the center and corners before the edges to make useful moves early in the search and improve pruning.

The browser AI also adjusts terminal scores by search depth. It prefers winning sooner and, if a loss cannot be avoided, delaying that loss. The search temporarily places marks on the board and removes them again while exploring alternatives.

### Python search

The Python implementation is in `tictactoe.py`. It uses recursive Minimax without alpha-beta pruning. Its terminal scores similarly favor quicker computer wins and later human wins. The program first constructs a separate tree of possible boards, then uses Minimax to evaluate candidate moves during play.

## Project structure

```text
.
├── index.html                 # Browser page and game container
├── style.css                  # Page layout and responsive styling
├── package.json               # npm scripts and dependencies
├── package-lock.json          # Locked npm dependency versions
├── tictactoe.py               # Standalone Python terminal game
└── src/
    ├── main.js                # Phaser configuration and startup
    ├── ai/
    │   └── minimax.js         # Winner/draw checks and browser AI
    └── game/
        └── TicTacToeScene.js  # Board, input, score, and round state
```

## Rules

- The board has nine cells arranged in three rows and three columns.
- Players alternate turns, marking one empty cell per turn.
- The first player to make a line of three marks horizontally, vertically, or diagonally wins.
- If all cells are filled without a winning line, the round is a draw.
