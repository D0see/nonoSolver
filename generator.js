function generateGrid (size) {

    const grid = [];

    for (let i = 0; i < size; i++) {
        grid.push((new Array(size)).fill(false))
    }

    return grid;
}

function randomizeGrid(grid) {

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            grid[y][x] = Math.random() < 0.5 ? false : true; 
        }
    }

    return grid;
}

function getColumnsInfos(grid) {

    const columnsInfos = [];

    for (let x = 0; x < grid[0].length; x++) {
        columnsInfos.push(getColumnInfo(grid, x));
    }

    return columnsInfos;
}

function getColumnInfo(grid, x) {
    const columnInfo = [];

    let currBlock = 0;

    for (let y = 0; y < grid.length; y++) {
        if (grid[y][x] === true) currBlock++;
        else if (currBlock > 0) {
            columnInfo.push(currBlock);
            currBlock = 0;
        }
    }

    if (currBlock > 0) columnInfo.push(currBlock);

    return columnInfo;
}

function getRowsInfos(grid) {

    const rowsInfos = [];

    for (let y = 0; y < grid.length; y++) {
        rowsInfos.push(getRowInfo(grid, y));
    }

    return rowsInfos;
}

function getRowInfo(grid, y) {
    const rowInfo = [];

    let currBlock = 0;

    for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === true) currBlock++;
        else if (currBlock > 0) {
            rowInfo.push(currBlock);
            currBlock = 0;
        }
    }

    if (currBlock > 0) rowInfo.push(currBlock);

    return rowInfo;
}

export function buildTestGrid(size) {

    const grid = randomizeGrid(generateGrid(size));

    return [
        getRowsInfos(grid),
        getColumnsInfos(grid)
    ];
}