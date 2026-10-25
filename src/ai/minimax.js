
const WIN_SCORE = 10;

/**
 * Returns the winner: "X", "O", or null.
 */
export function getWinner(board) {
    const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of winningLines) {
        if (
            board[a] !== null &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            return board[a];
        }
    }

    return null;
}

/**
 * Returns true when all cells are occupied.
 */
export function isDraw(board) {
    return getWinner(board) === null &&
        board.every(cell => cell !== null);
}

/**
 * Minimax with alpha-beta pruning.
 *
 * ai: computer symbol, normally "O"
 * human: player symbol, normally "X"
 *
 * depth is the number of moves made in this search.
 */
function minimax(
    board,
    depth,
    isMaximizing,
    ai,
    human,
    alpha,
    beta
) {
    const winner = getWinner(board);

    // Prefer winning sooner.
    if (winner === ai) {
        return WIN_SCORE - depth;
    }

    // Prefer delaying a forced loss.
    if (winner === human) {
        return depth - WIN_SCORE;
    }

    if (board.every(cell => cell !== null)) {
        return 0;
    }

    // Center and corners first can improve pruning.
    const moveOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (const index of moveOrder) {
            if (board[index] !== null) continue;

            board[index] = ai;

            const score = minimax(
                board,
                depth + 1,
                false,
                ai,
                human,
                alpha,
                beta
            );

            board[index] = null;

            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, bestScore);

            if (beta <= alpha) break;
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const index of moveOrder) {
        if (board[index] !== null) continue;

        board[index] = human;

        const score = minimax(
            board,
            depth + 1,
            true,
            ai,
            human,
            alpha,
            beta
        );

        board[index] = null;

        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);

        if (beta <= alpha) break;
    }

    return bestScore;
}

/**
 * Finds the best move for the computer.
 *
 * Returns a board index from 0 to 8.
 * Returns -1 if no moves are available.
 */
export function findBestMove(
    board,
    ai = "O",
    human = "X"
) {
    if (getWinner(board) !== null ||
        board.every(cell => cell !== null)) {
        return -1;
    }

    let bestScore = -Infinity;
    let bestMove = -1;

    const moveOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];

    for (const index of moveOrder) {
        if (board[index] !== null) continue;

        board[index] = ai;

        const score = minimax(
            board,
            0,
            false,
            ai,
            human,
            -Infinity,
            Infinity
        );

        board[index] = null;

        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }
    }

    return bestMove;
}
