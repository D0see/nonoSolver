import { generateGrid } from "./generator.mjs";

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

    for (const y in currGrid) {
        const rowArrangement = currGrid[y];
        if (currColArrangement[y] !== rowArrangement[currColIndex]) return false;
    }

    if (rowIndex > 1 && currColArrangement[rowIndex] !== rowArrangement[currColIndex]) return false;

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
    rowsArrangementsSorted, 
    columnsArrangements, 
    currRowsArrsIndex = 0, 
    currGrid = {}, 
    columnsArrangementsIndexes = new Array(columnsArrangements.length).fill(0),
    finalGrid = [false],
) {

    if (finalGrid[0]) return finalGrid[0];

    for (currRowsArrsIndex; currRowsArrsIndex < rowsArrangementsSorted.length; currRowsArrsIndex++) {

        const rowIndex = rowsArrangementsSorted[currRowsArrsIndex].y;
        const rowArrangements = rowsArrangementsSorted[currRowsArrsIndex].arrangements;

        for (const rowArrangement of rowArrangements) {

            //todo update this func
            const nextColumnsArrangementsIndexes = LoopThroughColumnsArrangementsUntilMatch(
                columnsArrangements, 
                rowArrangement, 
                currGrid, 
                rowIndex, 
                [...columnsArrangementsIndexes]
            );

            if (!nextColumnsArrangementsIndexes) continue;

            const nextGrid = 
            {
                ...currGrid, 
                [`${rowIndex}`]: rowArrangement
            };

            //if this was the last row, return the grid (ends the solve)
            if (rowIndex === rowsArrangementsSorted.length - 1) {
                finalGrid[0] = nextGrid;

                return finalGrid[0];
            }

             recursiveSolver(
                rowsArrangementsSorted,
                columnsArrangements, 
                currRowsArrsIndex + 1, 
                nextGrid,
                nextColumnsArrangementsIndexes,
                finalGrid,
            );

            if (finalGrid[0]) return finalGrid[0];
        }
    }

    return finalGrid[0];
}

//todo i could just store a map of true positions and check against that instead of storing the full grid
 function filterRowsAndColumnsAgainstEachother (
    rowsArrangements, 
    columnsArrangements,
) {

    let grid = generateGrid(
        rowsArrangements.length, 
        columnsArrangements.length, 
        () => true
    );

    //fill the grid with true present for all possible row arrangement
    for (const [y, rowArrangements] of rowsArrangements. entries()) {
        for (const rowArrangement of rowArrangements) {
            for (let x = 0; x < rowArrangement.length; x++) {
                if (rowArrangement[x] === false) grid[y][x] = false;
            }
        }
    }

    //prune columns
    for (const [x, columnArrangements] of columnsArrangements.entries()) {
        columnsArrangements[x] = columnArrangements.filter(function (columnArrangement) {
            for (let y = 0; y < columnArrangement.length; y++) {
                if (columnArrangement[y] === false && columnArrangement[y] !== grid[y][x]) return false;
            }
            return true;
        });
    }

    //fill the grid with true present for all possible column arrangements
    for (const [x, columnArrangements] of columnsArrangements.entries()) {
        for (const columnArrangement of columnArrangements) {
            for (let y = 0; y < columnArrangement.length; y++) {
                if (columnArrangement[y] === false) grid[y][x] = false;
            }
        }
    }

    //prune rows
    for (const [y, rowArrangements] of rowsArrangements.entries()) {
        rowsArrangements[y] = rowArrangements.filter(function (rowArrangement) {
            for (let x = 0; x < rowArrangement.length; x++) {
                if (rowArrangement[x] === false && rowArrangement[x] !== grid[y][x]) return false;
            }
            return true;
        });
    }

    return [ rowsArrangements, columnsArrangements, grid ]
}

 function prune(
    rowsArrangements,
    columnsArrangements
) {

    let numOfRowsArrangements = rowsArrangements.reduce((acc, val) => acc += val.length, 0);
    let numOfColumnsArrangements = columnsArrangements.reduce((acc, val) => acc += val.length, 0);
    let numOfPrunedRowsArrangements = -1;
    let numOfPrunedColumnsArrangements = -1;

    while (
        numOfRowsArrangements !== numOfPrunedRowsArrangements 
        && numOfColumnsArrangements !== numOfPrunedColumnsArrangements
    ) {

        numOfRowsArrangements = numOfPrunedRowsArrangements;
        numOfColumnsArrangements = numOfPrunedColumnsArrangements;

        let prunedRowsArrangement, prunedColumnsArrangements;
        [prunedRowsArrangement, prunedColumnsArrangements] =  filterRowsAndColumnsAgainstEachother(
            rowsArrangements, 
            columnsArrangements
        );

        numOfPrunedRowsArrangements = prunedRowsArrangement.reduce((acc, val) => acc += val.length, 0);
        numOfPrunedColumnsArrangements = prunedColumnsArrangements.reduce((acc, val) => acc += val.length, 0);
        rowsArrangements = prunedRowsArrangement;
        columnsArrangements = prunedColumnsArrangements;
    }

    return [rowsArrangements, columnsArrangements];
}

function sortBasedOnNumberOfElementsWhileSavingOriginalIndex(rowsArrangements) {
    return rowsArrangements.map(function (rowArrangements, index) {
        return {
            y: index,
            arrangements: rowArrangements
        }
    }).toSorted((a, b) => a.arrangements.length - b.arrangements.length);
}

export function solveNonogram (
    rows,
    columns
) {

    let rowsArrangements = rows.map(row => getArrangements(row, columns.length));
    let columnsArrangements = columns.map(column => getArrangements(column, rows.length));

    [rowsArrangements, columnsArrangements] = prune(
        rowsArrangements, 
        columnsArrangements
    );

    const rowsArrangementsSortedBasedOnNumberOfPermutations = sortBasedOnNumberOfElementsWhileSavingOriginalIndex(
        rowsArrangements
    );

    return recursiveSolver(rowsArrangementsSortedBasedOnNumberOfPermutations, columnsArrangements);
}


//the idea for this one is to sort the column based on number of permutations and start to solve
//from fewer perms rows to higher number of perms rows
