const rows = [
    [],
    [4],
    [3, 1],
    [2, 1],
    [2]
];

const columns = [
    [2],
    [3],
    [2, 1],
    [1, 1],
    [3]
];

const grid = new Array(rows.length).fill((new Array(columns.length).fill(null)));
    
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
        (inputArrIndex === 0 || currArrangement[currArrangement.length - 1] === null)
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
            [...currArrangement, null],
            arrangements
        );
    }

    return arrangements;
}

console.log(getArrangements([2, 1], 5)); 
// should be [ [ 2, null, 1, null ], [ 2, null, null, 1 ], [ null, 2, null, 1 ] ]


function arrangementFitsRow(grid, arrangement, y) {

    currIndex = 0;

    for (const boxSize of arrangement) {

        // if current box is a space and the current grid square is also a space
        if (boxSize === null && grid[y][currIndex] === null) {
            currIndex++;
            continue;
        // if current box is not null and current grid square isnt either
        } else if (boxSize !== null && grid[y][currIndex] === true) {
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

console.log(arrangementFitsRow([[true, true, null, true, null]], [ 2, null, 1, null ], 0)); 
// should be true

console.log(arrangementFitsRow([[true, true, null, null, null]], [ 2, null, 1, null ], 0)); 
// should be false

function insertArrangementIntoCol(grid, x, arrangement) {

    currIndex = 0;

    for (const boxSize of arrangement) {
        if (boxSize === null) {

            grid[currIndex][x] = null;
            currIndex++;

        } else if (boxSize !== null) {

            for (i = 0; i < boxSize; i++) {
                grid[currIndex][x] = true;
                currIndex++;
            }

        }
    } 

    return grid;
}

console.log(insertArrangementIntoCol([
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
], 1, [1, null, 2])); 

// should return [
//   [ null, true, null, null ],
//   [ null, null, null, null ],
//   [ null, true, null, null ],
//   [ null, true, null, null ]
// ]

function solve(
    rows, 
    columns, 
    rowIndex = 0, 
    colIndex = 0, 
    currGrid = new Array(rows.length).fill((new Array(columns.length).fill(null))), 
    finalGrid = [null]
) {
    if (finalGrid[0]) return finalGrid[0];

    // first we place the columns
    for (let x = colIndex; x < columns.length; x++) {
        const currBlockSizes = columns[x];
        const arrangements = getArrangements(currBlockSizes, columns.length);

        for (let i = 0; i < arrangements.length; i++) {
            const currArrangement = arrangements[i];

            const nextGrid = insertArrangementIntoCol(JSON.parse(JSON.stringify(currGrid)), x, currArrangement);

            solve(
                rows,
                columns, 
                rowIndex, 
                colIndex + 1, 
                nextGrid,
                finalGrid
            );

            if (finalGrid[0]) return finalGrid[0];
            
        }
    }

    //then we try to find a row arrangement which works
    for (let y = rowIndex; y < rows.length; y++) {
        const currBlockSizes = rows[y];
        const arrangements = getArrangements(currBlockSizes, rows.length);

        // if arrangement fits progress solve
        for (let i = 0; i < arrangements.length; i++) {
            
            if (arrangementFitsRow(currGrid, arrangements[i], y)) break;

            if (i === arrangements.length - 1) return;
        }

        solve(
            rows,
            columns, 
            rowIndex + 1, 
            colIndex, 
            currGrid,
            finalGrid
        );

        if (finalGrid[0]) return finalGrid[0];
    }

    finalGrid[0] = currGrid;

    return finalGrid[0];
}

console.log(solve(
    rows,
    columns
));
//should return [ [ true, null ], [ null, true ] ]

// for each rows and columns try every permutations until one works
// then proceeds to the next permutation, a permuation is considered
// working when all it square overlap with previously existing squares



