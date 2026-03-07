function getArrangements(
    numberArr, 
    totalLength, 
    numOfGaps = totalLength - numberArr.reduce((acc, val) => acc + val, 0), 
    numberArrIndex = 0, 
    currArrangement = [], 
    result = []
) {

    // if we are at the end of an arrangement and no gaps are left, we return the arrangement
    if (numberArrIndex === numberArr.length && numOfGaps === 0) {
        return result.push(currArrangement);
    }

    if (
        // if we have at least one block to place
        numberArrIndex < numberArr.length && 
        // if this is the first block or the last element was an empty space
        (numberArrIndex === 0 || currArrangement[currArrangement.length - 1] === false)
    ) {
        getArrangements(
            numberArr,
            totalLength, 
            numOfGaps, 
            numberArrIndex + 1,
            [...currArrangement, ...(new Array(numberArr[numberArrIndex])).fill(true)],
            result
        );
    }

    if (numOfGaps > 0) {
        getArrangements(
            numberArr,
            totalLength, 
            numOfGaps - 1, 
            numberArrIndex,
            [...currArrangement, false],
            result
        );
    }

    return result;
}

function colArrangementFitsRow(rowArrangement, currColArrangement, colIndex, rowIndex) {

    return currColArrangement[rowIndex] === rowArrangement[colIndex];
}

function filterPossibleColsArrangements(colsArrangement, rowArrangement, rowIndex){

    return colsArrangement.map((currColArrangements, colIndex) =>
        currColArrangements.filter(
            currColArrangement => colArrangementFitsRow(rowArrangement, currColArrangement, colIndex, rowIndex)
        )
    );
}

function recursiveSolver(
    rowsArrangements, 
    columnsArrangements, 
    rowIndex = 0, 
    colIndex = 0, 
    currGrid = [], 
    finalGrid = [false]
) {

    if (finalGrid[0]) return finalGrid[0];

    for (let y = rowIndex; y < rowsArrangements.length; y++) {

        for (const rowArrangement of rowsArrangements[y]) {

            //we check that every colsArrangement array holds at least one possible arrangement and if so we continue to solve this branch
            const possibleColsArrangements = filterPossibleColsArrangements(columnsArrangements, rowArrangement, rowIndex);
            if (possibleColsArrangements.some(arrangements => arrangements.length === 0)) continue;

            //append a reference to current rowArrangement to the current grid to build the solution step by step
            const nextGrid = [...currGrid, rowArrangement];

            //if this was the last row, return the grid (ends the solve)
            if (rowIndex === rowArrangement.length - 1) {
                finalGrid[0] = nextGrid;

                return finalGrid[0];
            }

            recursiveSolver(
                rowsArrangements,
                //only pass the pruned columns arrangements to this branch of the solve
                possibleColsArrangements, 
                rowIndex + 1, 
                colIndex, 
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
