// const board = ['X', ' ', 'O', ' ', 'X', ' ', 'O', ' ', ' '];

// 空白のセルを見つける関数
function emptyCells(board) {
    return board.reduce((acc, currentValue, currentIndex) => {
        if (currentValue === "") {
            acc.push(currentIndex);
        }
        return acc;
    }, []);
}

function MiniMax(board, ai) {
    console.log("minimax");
    console.log("ai", ai);
    console.log("board", board);
    ai;
    // 空白のセルを取得
    const empty = emptyCells(board);

    console.log("empty", empty);

    empty.forEach(e => {
        const newBoard = board.slice();
        newBoard[e] = ai;
        console.log("newBoard", newBoard);
    });

}


export default MiniMax;
