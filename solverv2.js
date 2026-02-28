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

function arrangementFitsRow(grid, arrangement, y, maxXIndex) {

    currX = 0;

    for (const boxSize of arrangement) {
        if (currX > maxXIndex) return true;

        // if current box is a space and the current grid square is also a space
        if (boxSize === false && grid[y][currX] === false) {
            currX++;
            continue;
        // if current box is not false and current grid square isnt either
        } else if (boxSize !== false && grid[y][currX] === true) {
            let i;
            for (i = 0; i < boxSize; i++) {
                if (currX + i > maxXIndex) return true;
                if (grid[y][currX + i] !== true) {
                    return false;
                }
                
            }

            currX += i;
        } else {
            return false;
        }
    }

    return true;
}

function filterPossibleRowsArrangements(rowsArrangements, nextGrid, colIndex){
    const possibleRowsArrangements = JSON.parse(JSON.stringify(rowsArrangements));
    
    for (const [rowIndex, rowArrangements] of rowsArrangements.entries()) {
        possibleRowsArrangements[rowIndex] = rowArrangements.filter(rowArrangement => arrangementFitsRow(nextGrid, rowArrangement, rowIndex, colIndex));
    }

    return possibleRowsArrangements;
}

function solver(
    rowsArrangements, 
    columnsArrangements, 
    rowIndex = 0, 
    colIndex = 0, 
    currGrid = new Array(rowsArrangements.length).fill((new Array(columnsArrangements.length).fill(false))), 
    finalGrid = [false]
) {
    if (colIndex === columnsArrangements) {
        finalGrid[0] = currGrid;

        return finalGrid[0];
    }

    if (finalGrid[0]) return finalGrid[0];

    for (let x = colIndex; x < columnsArrangements.length; x++) {
        const arrangements = columnsArrangements[x];

        for (let i = 0; i < arrangements.length; i++) {
            
            const currArrangement = arrangements[i];

            //todo instead of copying the grid, just pass a ref of the rows and test the columns instead
            const nextGrid = insertArrangementIntoCol(JSON.parse(JSON.stringify(currGrid)), x, currArrangement);

            //here we filter the rowsArrangement for ones that fits the currentcolumn arrangement
            const possibleRowsArrangements = filterPossibleRowsArrangements(rowsArrangements, nextGrid, colIndex);

            //then we check that every rowsArrangements array holds at least arrangement and if so we continue the solve
            if (possibleRowsArrangements.some(arrangements => arrangements.length === 0)) continue;

            if (colIndex === columnsArrangements.length - 1) {
                finalGrid[0] = nextGrid;

                return finalGrid[0];
            }

            solver(
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

console.log(solveNonogram(
        [
            [1, 1],
            [1 ,1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 2],
        ], 
        [
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [2, 1]
        ]
    )
);