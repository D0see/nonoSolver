function getArrangements(
    blockSizes, 
    lineLength, 
    gaps = lineLength - blockSizes.reduce((acc, val) => acc + val, 0), 
    inputArrIndex = 0, 
    currArrangement = [], 
    arrangements = []
) {

    // if we are at the end of an arrangement and no gaps are left, we return the arrangement
    if (inputArrIndex === blockSizes.length && gaps === 0) {
        arrangements.push(currArrangement);
        return arrangements;
    }

    if (
        // if we have at least one block to place
        inputArrIndex < blockSizes.length && 
        // if this is the first block or the last element was an empty space
        (inputArrIndex === 0 || currArrangement[currArrangement.length - 1] === false)
    ) {
        getArrangements(
            blockSizes,
            lineLength, 
            gaps, 
            inputArrIndex + 1,
            [...currArrangement, ...(new Array(blockSizes[inputArrIndex])).fill(true)],
            arrangements
        );
    }

    if (gaps > 0) {
        getArrangements(
            blockSizes,
            lineLength, 
            gaps - 1, 
            inputArrIndex,
            [...currArrangement, false],
            arrangements
        );
    }

    return arrangements;
}

function insertArrangementIntoCol(grid, x, arrangement) {

    for (const [index, state] of arrangement.entries()) {
        grid[index][x] = state;
    } 

    return grid;
}

function arrangementFitsCol(grid, arrangement, y, colIndex) {

    return arrangement[colIndex] === grid[y][colIndex];
}

function filterPossibleRowsArrangements(rowsArrangements, nextGrid, colIndex){
    const possibleRowsArrangements = [];
    
    for (const [rowIndex, currRowArrangements] of rowsArrangements.entries()) {
        possibleRowsArrangements.push(
            currRowArrangements.filter(
                currRowArrangement => arrangementFitsCol(nextGrid, currRowArrangement, rowIndex, colIndex)
            )
        );
    }

    return possibleRowsArrangements;
}

function recursiveSolver(
    rowsArrangements, 
    columnsArrangements, 
    rowIndex = 0, 
    colIndex = 0, 
    currGrid = new Array(rowsArrangements.length).fill((new Array(columnsArrangements.length).fill(false))), 
    finalGrid = [false]
) {

    if (finalGrid[0]) return finalGrid[0];

    for (let x = colIndex; x < columnsArrangements.length; x++) {
        const arrangements = columnsArrangements[x];

        for (const colArrangement of arrangements) {

            //todo instead of copying the grid, just pass a ref of the rows and test the columns instead (massive perf gain)
            const nextGrid = insertArrangementIntoCol(JSON.parse(JSON.stringify(currGrid)), x, colArrangement);

            //here we filter the rowsArrangement for ones that fits the currentcolumn arrangement
            const possibleRowsArrangements = filterPossibleRowsArrangements(rowsArrangements, nextGrid, colIndex);

            //then we check that every rowsArrangements array holds at least arrangement and if so we continue the solve
            if (possibleRowsArrangements.some(arrangements => arrangements.length === 0)) continue;

            //if this was the last column, return the grid
            if (colIndex === columnsArrangements.length - 1) {
                finalGrid[0] = nextGrid;

                return finalGrid[0];
            }

            recursiveSolver(
                possibleRowsArrangements,
                columnsArrangements, 
                rowIndex, 
                colIndex + 1, 
                nextGrid,
                finalGrid
            );

            if (finalGrid[0]) return finalGrid[0];
        }
    }

    return finalGrid[0];
}

export function solveNonogram (
    rows,
    columns
) {

    const rowsArrangements = rows.map(row => getArrangements(row, columns.length));
    const columnsArrangements = columns.map(column => getArrangements(column, rows.length));

    return recursiveSolver(rowsArrangements, columnsArrangements);
}