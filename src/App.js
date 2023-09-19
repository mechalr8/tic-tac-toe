import React, { useState, useEffect } from "react";
import gameHeader from "./assets/gameHeader.png";
import gameBody from "./assets/gameBody.png";
import gameLogo from "./assets/gameLogo.png";
import brandLogo from "./assets/brandLogo.png";
import bodyBottom from "./assets/bodyBottom.png";
import cross from "./assets/cross.png";
import gameFooter from "./assets/gameFooter.png";
import gamefinishBgNotWin from "./assets/gameFinishBgNotWin.png";
import drawRxn from "./assets/drawRxn.png";
import loseRxn from "./assets/loseRxn.png";
import brandAdImg from "./assets/brandAdImg.png";
import star from "./assets/star.png";
import congratsBG from "./assets/congratsBG.png";
import hr from "./assets/hr.png";
// Function to check the winner
const checkWinner = (currentBoard) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
        if (
            currentBoard[a] &&
            currentBoard[a] === currentBoard[b] &&
            currentBoard[a] === currentBoard[c]
        ) {
            return currentBoard[a];
        }
    }

    if (!currentBoard.includes(null)) {
        // It's a draw
        return "tie";
    }
    return null;
};

function App() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [chance, setChance] = useState(localStorage.getItem("chance") || 3);
    const arr = [1, 0, 0];
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        localStorage.setItem("chance", chance);
        setChance(localStorage.getItem("chance"));
        if (!xIsNext && !gameOver) {
            // Bot's turn
            const timer = setTimeout(
                arr[Math.floor(Math.random() * 3)] === 1
                    ? makeBotMoveMinMax()
                    : makeBotMoveRandom(),
                1000
            ); // Delay for bot move
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xIsNext, gameOver, checkWinner(board)]);

    const handleClick = (index) => {
        if (board[index] || gameOver) {
            return;
        }
        console.log("chance: ", chance);
        const newBoard = [...board];
        newBoard[index] = brandLogo;
        setBoard(newBoard);
        setXIsNext(false);
        const winner = checkWinner(newBoard);
        console.log("handleClick: ", winner);
        if (winner) {
            setGameOver(true);
            if (winner === brandLogo) {
                setChance(0);
            } else if (winner === "tie") {
                setChance((a) => a - 1);
            }
        }
    };

    const makeBotMoveRandom = () => {
        if (gameOver) {
            return;
        }

        let randomMove;
        do {
            randomMove = Math.floor(Math.random() * 9);
        } while (board[randomMove]);

        const newBoard = [...board];
        newBoard[randomMove] = cross;
        setBoard(newBoard);
        setXIsNext(true);
        const winner = checkWinner(newBoard);
        if (winner) {
            setGameOver(true);
            if (winner === cross || winner === "tie") {
                setChance((a) => a - 1);
            }
        }
    };

    const makeBotMoveMinMax = () => {
        if (gameOver) {
            return;
        }
        const bestMove = getBestMove(board);
        const newBoard = [...board];
        newBoard[bestMove.index] = cross;
        setBoard(newBoard);
        setXIsNext(true);
        const winner = checkWinner(newBoard);
        if (winner) {
            setGameOver(true);
            if (winner === cross || winner === "tie") {
                setChance((a) => a - 1);
            }
        }
    };

    const getBestMove = (currentBoard) => {
        let bestMove = null;
        let bestScore = -Infinity;

        for (let i = 0; i < currentBoard.length; i++) {
            if (!currentBoard[i]) {
                currentBoard[i] = cross;
                const score = minimax(currentBoard, 0, false);
                currentBoard[i] = null;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { index: i, score };
                }
            }
        }

        return bestMove;
    };

    const minimax = (currentBoard, depth, isMaximizing) => {
        const result = checkWinner(currentBoard);
        if (result) {
            return result === cross ? 1 : result === brandLogo ? -1 : 0;
        }

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (let i = 0; i < currentBoard.length; i++) {
                if (!currentBoard[i]) {
                    currentBoard[i] = cross;
                    const score = minimax(currentBoard, depth + 1, false);
                    currentBoard[i] = null;
                    maxScore = Math.max(maxScore, score);
                }
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (let i = 0; i < currentBoard.length; i++) {
                if (!currentBoard[i]) {
                    currentBoard[i] = brandLogo;
                    const score = minimax(currentBoard, depth + 1, true);
                    currentBoard[i] = null;
                    minScore = Math.min(minScore, score);
                }
            }
            return minScore;
        }
    };

    const renderSquare = (index) => {
        return (
            <div>
                {!gameOver ? (
                    <button
                        className='square'
                        onClick={() => handleClick(index)}
                        style={
                            index === 0
                                ? { borderRadius: "15px 0px 0px 0px" }
                                : index === 2
                                ? { borderRadius: "0px 15px 0px 0px" }
                                : index === 6
                                ? { borderRadius: "0px 0px 0px 15px" }
                                : index === 8
                                ? { borderRadius: "0px 0px 15px 0px" }
                                : { borderRadius: "" }
                        }
                        disabled={isDisabled || board[index] || gameOver}
                    >
                        {board[index] ? (
                            <img
                                style={
                                    board[index] === brandLogo
                                        ? {
                                              width: "70px",
                                              aspectRatio: "1",
                                              marginTop: "5px",
                                          }
                                        : { width: "45px", aspectRatio: "1" }
                                }
                                src={board[index]}
                                alt='tictactoe'
                            />
                        ) : (
                            ""
                        )}
                    </button>
                ) : checkWinner(board) !== brandLogo ? (
                    <img
                        className='gameFinishBg'
                        src={gamefinishBgNotWin}
                        alt='finished'
                    />
                ) : (
                    <div></div>
                )}
            </div>
        );
    };

    // const status = gameOver
    //     ? `Game Over. Winner: ${
    //           checkWinner(board) === brandLogo
    //               ? "you"
    //               : checkWinner(board) === cross
    //               ? "bot"
    //               : "tie"
    //       }`
    //     : `Next player: ${xIsNext ? "you" : "bot"}`;

    // if (count >= 3) return <div>Your tries are over</div>;
    const onStartHandler = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
        setGameOver(false);
        setGameStart(true);
        setIsDisabled(false);
    };
    return (
        <div className='app'>
            <div>
                <div className='branding'>
                    <img className='gameLogo' src={gameLogo} alt='gameLogo' />
                    <img className='brandLogo' src={brandLogo} alt='gameLogo' />
                </div>
                <div className='gameHeader'>
                    <img src={gameHeader} alt='gameHeader' />
                </div>
            </div>
            {localStorage.getItem("chance") > 0 ? (
                <div>
                    <div>
                        <div className='gameBody'>
                            <img
                                className='gameBodyImg'
                                src={gameBody}
                                alt='gameBody'
                            />
                            {!gameOver ? (
                                <div className='board'>
                                    <div className='board-row'>
                                        {renderSquare(0)}
                                        {renderSquare(1)}
                                        {renderSquare(2)}
                                    </div>
                                    <div className='board-row'>
                                        {renderSquare(3)}
                                        {renderSquare(4)}
                                        {renderSquare(5)}
                                    </div>
                                    <div className='board-row'>
                                        {renderSquare(6)}
                                        {renderSquare(7)}
                                        {renderSquare(8)}
                                    </div>
                                </div>
                            ) : checkWinner(board) !== brandLogo ? (
                                <div className='gameResultNotWin'>
                                    <div className='rxnContainer'>
                                        <img
                                            className='rxnImg'
                                            src={
                                                checkWinner(board) !== cross
                                                    ? drawRxn
                                                    : loseRxn
                                            }
                                            alt='draw'
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <img
                                            className='gameFinishBgNotWin'
                                            src={gamefinishBgNotWin}
                                            alt='finished'
                                        />
                                        <div className='gameResultNotWinText'>
                                            {checkWinner(board) !== cross
                                                ? "DRAW"
                                                : "YOU LOSE!"}
                                        </div>
                                        <div className='chancesLeft'>
                                            {chance}{" "}
                                            {chance > 1 ? "chances" : "chance"}{" "}
                                            left!
                                        </div>
                                        <div
                                            className='gameRestart'
                                            onClick={onStartHandler}
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                            <div
                                className='startGame'
                                style={{
                                    display:
                                        gameOver || gameStart ? "none" : "",
                                }}
                                onClick={onStartHandler}
                            ></div>
                        </div>
                    </div>
                    <div className='footer'>
                        <div className='bodyBottom'>
                            <img
                                className='bodyBottomImg'
                                src={bodyBottom}
                                alt='footer'
                            />
                            <div className='resultInfo'>
                                Win: 0 | Lose: 0 | Tie: 0
                            </div>
                        </div>
                        <div>
                            <img
                                className='gameFooter'
                                src={gameFooter}
                                alt='footer'
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <img
                        className='brandAdImg'
                        src={brandAdImg}
                        alt='brandAdImg'
                    />
                    <div className='wishes'>
                        <img className='star' src={star} alt='star' />
                        <p className='wishesText'>
                            &#903;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Congartulations&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#903;
                        </p>
                        <img className='star' src={star} alt='star' />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: 'center'
                        }}
                    >
                        <img
                            className='congratsBG'
                            src={congratsBG}
                            alt='congratsBG'
                        />
                        <div className='discountAmount'>Flat 65% discount</div>
                        <div className='discountCode'>FRENZY65</div>
                        <div className="hr">
                            <img
                                style={{
                                    width: "200px",
                                    height: "2px"
                                }}
                                src={hr}
                                alt='hr'
                            />
                        </div>
                        <div className='discountInstruction'>
                            <p style={{ margin: "0px", padding: "0px" }}>
                                Please screen capture your device
                            </p>
                            <p style={{ margin: "0px", padding: "0px" }}>
                                to keep this code.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
