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
        // if we have at least on block to place
        inputArrIndex < blockSizes.length && 
        // if this is the fist block or the last element was an empty space
        (inputArrIndex === 0 || currArrangement[currArrangement.length - 1] === false)
    ) {
        getArrangements(
            blockSizes,
            lineLength, 
            gaps, 
            inputArrIndex + 1,
            [...currArrangement, blockSizes[inputArrIndex]],
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

function arrangementFitsRow(grid, arrangement, y) {

    currIndex = 0;

    for (const boxSize of arrangement) {

        // if current box is a space and the current grid square is also a space
        if (boxSize === false && grid[y][currIndex] === false) {
            currIndex++;
            continue;
        // if current box is not false and current grid square isnt either
        } else if (boxSize !== false && grid[y][currIndex] === true) {
            for (i = 0; i < boxSize; i++) {
                if (grid[y][currIndex + i] !== true) {
                    return false;
                }
            }
            currIndex += boxSize;
        } else {
            return false;
        }
    }

    return true;
}

function insertArrangementIntoCol(grid, x, arrangement) {

    currIndex = 0;

    for (const boxSize of arrangement) {
        if (boxSize === false) {

            grid[currIndex][x] = false;
            currIndex++;

        } else if (boxSize !== false) {

            for (i = 0; i < boxSize; i++) {
                grid[currIndex][x] = true;
                currIndex++;
            }

        }
    } 

    return grid;
}

function solver(
    rowsArrangements, 
    columnsArrangements, 
    rowIndex = 0, 
    colIndex = 0, 
    currGrid = new Array(rowsArrangements.length).fill((new Array(columnsArrangements.length).fill(false))), 
    finalGrid = [false]
) {
    if (finalGrid[0]) return finalGrid[0];

    // first we place the columns
    for (let x = colIndex; x < columnsArrangements.length; x++) {
        const arrangements = columnsArrangements[x];
        //todo maybe we could rework this part and invalidate rows just when they are placed testing them to see if at least one column
        // arrangements fits
        // maybe we could filter the column arrangement which fits and only test further columns against those
        for (let i = 0; i < arrangements.length; i++) {
            const currArrangement = arrangements[i];

            //todo instead of copying the grid, just pass a ref of the rows and test the columns instead
            const nextGrid = insertArrangementIntoCol(JSON.parse(JSON.stringify(currGrid)), x, currArrangement);

            solver(
                rowsArrangements,
                columnsArrangements, 
                rowIndex, 
                colIndex + 1, 
                nextGrid,
                finalGrid
            );

            if (finalGrid[0]) return finalGrid[0];
            
        }
    }

    //then we try to find a row arrangement which works
    for (let y = rowIndex; y < rowsArrangements.length; y++) {
        const arrangements = rowsArrangements[y];

        // if arrangement fits progress solve
        for (let i = 0; i < arrangements.length; i++) {
            
            if (arrangementFitsRow(currGrid, arrangements[i], y)) {
                solver(
                    rowsArrangements,
                    columnsArrangements,  
                    rowIndex + 1, 
                    colIndex, 
                    currGrid,
                    finalGrid
                );

                if (finalGrid[0]) return finalGrid[0];
            }

            if (i === arrangements.length - 1) return;
        }

    }

    finalGrid[0] = currGrid;

    return finalGrid[0];
}

function solveNonogram (
    rows,
    columns
) {

    const rowsArrangements = rows.map(row => getArrangements(row, columns.length));
    const columnsArrangements = columns.map(column => getArrangements(column, rows.length));

    return solver(rowsArrangements, columnsArrangements);
}

console.log(solveNonogram(
        [
            [1],
            [4],
            [3, 1],
            [2, 1],
            [2]
        ], 
        [
            [1, 2],
            [3],
            [2, 1],
            [1, 1],
            [3],
        ]
    )
);

// console.log(solveNonogram(
//         [
//             [1, 1],
//             [1 ,1],
//             [1, 1],
//             [1, 1],
//             [1, 1]
//         ], 
//         [
//             [1, 1],
//             [1, 1],
//             [1, 1],
//             [1, 1],
//             [1, 1],
//         ]
//     )
// );

// for each rows and columns try every permutations until one works
// then proceeds to the next permutation, a permuation is considered
// working when all it square overlap with previously existing squares