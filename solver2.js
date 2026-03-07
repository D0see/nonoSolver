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

function currColArrangementFitsRow(currColArrangement, currColIndex, rowArrangement, rowIndex, currGrid) {

    for (let y = 0; y < currGrid.length; y++) {
        if (currColArrangement[y] !== currGrid[y][currColIndex]) return false;
    }

    if (currGrid.length && currColArrangement[rowIndex] !== rowArrangement[currColIndex]) return false;

    return true;
}

function LoopThroughColumnsArrangementsUntilMatch(colsArrangements, rowArrangement, currGrid, rowIndex, columnsArrangementsIndexes) {

    outerLoop: for (const [currColIndex, colArrangements] of colsArrangements.entries()) {
        for (let i = columnsArrangementsIndexes[currColIndex]; i < colArrangements.length; i++) {
            const currColArrangement = colArrangements[i];
            if (currColArrangementFitsRow(
                currColArrangement, 
                currColIndex,
                rowArrangement, 
                rowIndex, 
                currGrid)
            ) {
                columnsArrangementsIndexes[currColIndex] = i;
                continue outerLoop;
            } else if (i === colArrangements.length - 1) {
                return false;
            }
        }
    }

    return columnsArrangementsIndexes;

}

function recursiveSolver(
    rowsArrangements, 
    columnsArrangements, 
    rowIndex = 0, 
    colIndex = 0, 
    currGrid = [], 
    columnsArrangementsIndexes = new Array(columnsArrangements.length).fill(0),
    finalGrid = [false]
) {

    if (finalGrid[0]) return finalGrid[0];

    for (let y = rowIndex; y < rowsArrangements.length; y++) {

        for (const rowArrangement of rowsArrangements[y]) {

            const nextColumnsArrangementsIndexes = LoopThroughColumnsArrangementsUntilMatch(
                columnsArrangements, 
                rowArrangement, 
                currGrid, 
                rowIndex, 
                [...columnsArrangementsIndexes]
            );

            if (!nextColumnsArrangementsIndexes) continue;

            //append a reference to current rowArrangement to the current grid to build the solution step by step
            const nextGrid = [...currGrid, rowArrangement];

            //if this was the last row, return the grid (ends the solve)
            if (rowIndex === rowArrangement.length - 1) {
                finalGrid[0] = nextGrid;

                return finalGrid[0];
            }

            recursiveSolver(
                rowsArrangements,
                columnsArrangements, 
                rowIndex + 1, 
                colIndex, 
                nextGrid,
                nextColumnsArrangementsIndexes,
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

//im kind of out of ideas, i think i might need to find a way to use memoization but i cant seem to find a way so far

//might need a completely need approach, similar to solving by hand