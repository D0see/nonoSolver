import { generateGrid } from "./generator.js";

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

//todo i could just store a map of true positions and check against that instead of storing the full grid
//rework function to reuse grid building logic from generator.js

//i could use this strategy until no further progress is made and then recursive brute force the rest
function pruneRowsAndColumnsArrangements (
    rowsArrangements, 
    columnsArrangements
) {

    let grid = generateGrid(
        rowsArrangements.length, 
        columnsArrangements.length, 
        true
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

    grid = generateGrid(
        rowsArrangements.length, 
        columnsArrangements.length, 
        true
    );

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

    return [ rowsArrangements, columnsArrangements ]
}

export function solveNonogram (
    rows,
    columns
) {

    const rowsArrangements = rows.map(row => getArrangements(row, columns.length));
    const columnsArrangements = columns.map(column => getArrangements(column, rows.length));

    const [ prunedRowsArrangement, prunedColumnsArrangements ] = pruneRowsAndColumnsArrangements(
        rowsArrangements, 
        columnsArrangements
    );

    return recursiveSolver(rowsArrangements, columnsArrangements);
}

// solveNonogram(
//     [
//         [ 1, 4, 1 ], [ 2, 4 ],      
//         [ 2, 2, 2 ], [ 1, 1, 3 ],   
//         [ 4 ],       [ 1, 1, 3 ],   
//         [ 3, 1 ],    [ 2, 1, 1 ],   
//         [ 1, 3, 1 ], [ 1, 3, 2 ]    
//     ],
//     [
//         [ 2, 1, 3 ],    [ 3, 2 ],   
//         [ 1, 1, 2 ],    [ 1, 1, 2 ],
//         [ 1, 1, 1, 3 ], [ 1, 1, 1 ],
//         [ 5 ],          [ 1, 3, 1 ],
//         [ 6, 2 ],       [ 2, 2, 1 ] 
//     ]
// )

//im kind of out of ideas, i think i might need to find a way to use memoization but i cant seem to find a way so far

//pre-solve the grid with blocks that are present in every row permutations and prune columns against that ?