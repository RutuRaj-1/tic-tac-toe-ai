import math

# ----------------------------
# Tic Tac Toe using Minimax
# ----------------------------

HUMAN = 'O'
COMPUTER = 'X'
EMPTY = ' '


class TreeNode:
    def __init__(self, board):
        self.board = [row[:] for row in board]
        self.children = []
        self.score = None


class TicTacToe:

    def __init__(self):
        self.board = [[EMPTY for _ in range(3)] for _ in range(3)]

    # ----------------------------
    # Display Board
    # ----------------------------
    def print_board(self):
        print()
        for i in range(3):
            print(" | ".join(self.board[i]))
            if i != 2:
                print("--+---+--")
        print()

    # ----------------------------
    # Check Winner
    # ----------------------------
    def check_winner(self, board):

        # Rows
        for row in board:
            if row[0] == row[1] == row[2] != EMPTY:
                return row[0]

        # Columns
        for col in range(3):
            if board[0][col] == board[1][col] == board[2][col] != EMPTY:
                return board[0][col]

        # Diagonals
        if board[0][0] == board[1][1] == board[2][2] != EMPTY:
            return board[0][0]

        if board[0][2] == board[1][1] == board[2][0] != EMPTY:
            return board[0][2]

        return None

    # ----------------------------
    # Check Draw
    # ----------------------------
    def is_draw(self, board):
        for row in board:
            if EMPTY in row:
                return False
        return self.check_winner(board) is None

    # ----------------------------
    # Evaluate Board
    # ----------------------------
    def evaluate(self, board):

        winner = self.check_winner(board)

        if winner == COMPUTER:
            return 10

        if winner == HUMAN:
            return -10

        return 0

    # ----------------------------
    # Generate Tree
    # ----------------------------
    def generate_tree(self, node, isMax):

        winner = self.check_winner(node.board)

        if winner or self.is_draw(node.board):
            node.score = self.evaluate(node.board)
            return

        for i in range(3):
            for j in range(3):

                if node.board[i][j] == EMPTY:

                    new_board = [row[:] for row in node.board]

                    if isMax:
                        new_board[i][j] = COMPUTER
                    else:
                        new_board[i][j] = HUMAN

                    child = TreeNode(new_board)
                    node.children.append(child)

                    self.generate_tree(child, not isMax)

    # ----------------------------
    # Minimax
    # ----------------------------
    def minimax(self, board, depth, isMax):

        score = self.evaluate(board)

        if score == 10:
            return score - depth

        if score == -10:
            return score + depth

        if self.is_draw(board):
            return 0

        if isMax:

            best = -math.inf

            for i in range(3):
                for j in range(3):

                    if board[i][j] == EMPTY:

                        board[i][j] = COMPUTER

                        value = self.minimax(board, depth + 1, False)

                        board[i][j] = EMPTY

                        best = max(best, value)

            return best

        else:

            best = math.inf

            for i in range(3):
                for j in range(3):

                    if board[i][j] == EMPTY:

                        board[i][j] = HUMAN

                        value = self.minimax(board, depth + 1, True)

                        board[i][j] = EMPTY

                        best = min(best, value)

            return best

    # ----------------------------
    # Best Computer Move
    # ----------------------------
    def find_best_move(self):

        bestScore = -math.inf

        bestMove = (-1, -1)

        print("\nMove Evaluation")

        for i in range(3):
            for j in range(3):

                if self.board[i][j] == EMPTY:

                    self.board[i][j] = COMPUTER

                    score = self.minimax(self.board, 0, False)

                    self.board[i][j] = EMPTY

                    print(f"({i},{j}) -> {score}")

                    if score > bestScore:
                        bestScore = score
                        bestMove = (i, j)

        print("\nBest Score:", bestScore)

        return bestMove

    # ----------------------------
    # Human Move
    # ----------------------------
    def human_move(self):

        while True:

            try:
                row = int(input("Row (0-2): "))
                col = int(input("Column (0-2): "))

                if self.board[row][col] == EMPTY:
                    self.board[row][col] = HUMAN
                    break

                print("Cell already occupied.")

            except:
                print("Invalid Input.")

    # ----------------------------
    # Computer Move
    # ----------------------------
    def computer_move(self):

        row, col = self.find_best_move()

        self.board[row][col] = COMPUTER

        print(f"\nComputer played at ({row},{col})")

    # ----------------------------
    # Game Loop
    # ----------------------------
    def play(self):

        print("\n====== TIC TAC TOE ======\n")
        print("Human : O")
        print("Computer : X\n")

        while True:

            self.print_board()

            self.human_move()

            winner = self.check_winner(self.board)

            if winner == HUMAN:
                self.print_board()
                print("Human Wins")
                break

            if self.is_draw(self.board):
                self.print_board()
                print("Draw")
                break

            self.computer_move()

            winner = self.check_winner(self.board)

            if winner == COMPUTER:
                self.print_board()
                print("Computer Wins")
                break

            if self.is_draw(self.board):
                self.print_board()
                print("Draw")
                break


# ----------------------------
# Main
# ----------------------------

game = TicTacToe()

# Build complete game tree (optional)
root = TreeNode(game.board)
game.generate_tree(root, True)
game.play()