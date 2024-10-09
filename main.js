/*----- constants -----*/
const colorLookup = {
    '0': 'white',
    '1': 'red',
    '-1': 'blue',
}


/*----- app's state (varibles) -----*/
let board, turn, winner;

/*----- cached element references -----*/
const msgEL = document.getElementById("msg");
const markerEls = [...document.querySelectorAll("#markers > div")];
const replayBtn = document.querySelector("button")

/*----- event listeners -----*/
document.getElementById("markers").addEventListener("click", handleDrop);
replayBtn.addEventListener("click", init)


/*----- functions -----*/
init();


function handleDrop(evt) {
    // A marker has been clciked, updated all impacted state call render
    
    // Get the index of the clicked marker (col)
    const colIdx = markerEls.indexOf(evt.target);
    if (colIdx === -1 || winner) return;

    const colArr = board[colIdx];

    // Find the first open cell in the colArr
    const rowIdx = colArr.indexOf(0);
    if (rowIdx === -1) return;
    colArr[rowIdx] = turn;
    turn *= -1;

    winner = getWinner()
    render()
}

function getWinner() {
    let winner = null;
    for (let colIdx = 0; colIdx <= 6; colIdx++) {
        winner = checkCol(colIdx);
        if (winner) break;
    }

    // TODO: Add tie logic
    return winner;
}

function checkCol(colIdx) {
    const colArr = board[colIdx]
    for (let rowIdx = 0; rowIdx < colArr.length; rowIdx++) {
        let winner = checkUp(colArr, rowIdx) || checkRight(colIdx, rowIdx) || checkDiag(colIdx, rowIdx, 1) || checkDiag(colIdx, rowIdx, -1);
        if (winner) return winner;
    }
    return null;
}

function checkUp(colArr, rowIdx) {
    // Boundary check
    if (colArr > 2) return null;
    if (Math.abs(colArr[rowIdx] + colArr[rowIdx + 1] + colArr[rowIdx + 2] + colArr[rowIdx + 3]) === 4) {
        return colArr[rowIdx];
    } else {
        return null;
    }
}

function checkRight(colIdx, rowIdx) {
    // Boundary check
    if (colIdx > 3) return null;
    const total = board[colIdx][rowIdx] + board[colIdx + 1][rowIdx] + board[colIdx + 2][rowIdx] + board[colIdx + 3][rowIdx];
    if (Math.abs(total) === 4) {
        return board[colIdx][rowIdx];
    } else {
        return null;
    }
}


function checkDiag(colIdx, rowIdx, dir) {
    // Boundary check
    if (dir > 0 && colIdx > 3 || dir > 0 && rowIdx > 2) return null;
    if (dir < 0 && colIdx > 3 || dir > 0 && rowIdx < 3) return null;
    const total = board[colIdx][rowIdx] + board[colIdx + 1][rowIdx + dir] + board[colIdx + 2][rowIdx + dir * 2] + board[colIdx + 3][rowIdx + dir * 3];
    if (Math.abs(total) === 4) {
        return board[colIdx][rowIdx];
    } else {
        return null;
    }
}

function init() {
    // initialize all state
    board = [
        [0, 0, 0, 0, 0, 0], // Column 0
        [0, 0, 0, 0, 0, 0], // Column 1
        [0, 0, 0, 0, 0, 0], // Column 2
        [0, 0, 0, 0, 0, 0], // Column 3
        [0, 0, 0, 0, 0, 0], // Column 4
        [0, 0, 0, 0, 0, 0], // Column 5
        [0, 0, 0, 0, 0, 0], // Column 6
    ];
    turn = 1;
    winner = null;
    render();
}

function render() {
    // render the board
    board.forEach(function(colArr, colIdx) {
        // iterate over the column array to access the cell vals
        colArr.forEach(function(cellVal, rowIdx) {
            // select the correct div for this cell val
            const div = document.getElementById(`c${colIdx}r${rowIdx}`);
            div.style.backgroundColor = colorLookup[cellVal];
        });
        markerEls[colIdx].style.visibility = colArr.includes(0) ? "visible" : "hidden";
    });
    
    if (winner === "T") {
        msgEL.innerHTML = "It's a tie!"
    } else if (winner) {
        // A player has one
        msgEL.innerHTML = `<span style="color: ${colorLookup[winner]}">${colorLookup[winner].charAt(0).toUpperCase() + colorLookup[winner].slice(1)}</span> Wins!`
    } else {
        // No winner yet, show whose turn it is
        msgEL.innerHTML = `<span style="color: ${colorLookup[turn]}">${colorLookup[turn].charAt(0).toUpperCase() + colorLookup[turn].slice(1)}</span>'s Turn`
    }

    replayBtn.style.visibility = winner ? "visible" : "hidden";
}   
