import { generateGrid, buildTestGrid } from "./generator.mjs";
import { DomElementNameEnum } from './DomElementNameEnum.mjs';
import { DomElementColorsEnum } from "./DomElementColorsEnum.mjs";
import { HTMLElementIdEnum } from "./HTMLElementIdEnum.mjs";
import { solveNonogram as nonogramSolver3VisualEdition } from './solver3visualization.mjs';
import { solveNonogram as nonogramSolver4VisualEdition } from './solver4visualization.mjs';
import { delay } from './utils.mjs'

const container = document.getElementById(HTMLElementIdEnum.GRID);
const rowsInfos = document.getElementById(HTMLElementIdEnum.ROWS_INFOS);
const columnsInfos = document.getElementById(HTMLElementIdEnum.COLUMNS_INFOS);
const rowsPermutationsInfos = document.getElementById(HTMLElementIdEnum.ROWS_PERMUTATIONS_INFOS);
const columnsPermutationsInfos = document.getElementById(HTMLElementIdEnum.COLUMNS_PERMUTATIONS_INFOS);

async function generateVisualization(
    columns, 
    rows,
    container,
    solverFn,
    //delay = 15 todo add delay
) {

    container.innerHTML = "";

    const concreteGrid = generateGrid(
        rows.length, columns.length, () => document.createElement(DomElementNameEnum.CONCRETE_BLOCK)
    );

    container.style.gridTemplateColumns = 'repeat(' + columns.length + ', 1fr)';
    container.style.gridTemplateRows = 'repeat(' + rows.length + ', 1fr)';

    //generate rows infos
    rowsInfos.innerHTML = "";
    rowsInfos.style.gridTemplateRows = 'repeat(' + rows.length + ', 1fr)';

    for (const row of rows) {
        const currRowInfos = document.createElement(DomElementNameEnum.ROW_INFO);
        currRowInfos.innerText = row.join(' ');
        rowsInfos.appendChild(currRowInfos);
    }

    //reset rows permutations infos
    rowsPermutationsInfos.innerHTML = "";
    rowsPermutationsInfos.style.gridTemplateRows = 'repeat(' + rows.length + ', 1fr)';

    for (const row of rows) {
        const rowPermutationsInfos = document.createElement(DomElementNameEnum.ROW_PERMUTATIONS_INFOS);
        rowsPermutationsInfos.appendChild(rowPermutationsInfos);
    }

    //reset columns permutations infos
    columnsPermutationsInfos.innerHTML = "";
    columnsPermutationsInfos.style.gridTemplateColumns = 'repeat(' + columns.length + ', 1fr)';

    for (const column of columns) {
        const columnPermutationsInfos = document.createElement(DomElementNameEnum.COLUMN_PERMUTATIONS_INFOS);
        columnsPermutationsInfos.appendChild(columnPermutationsInfos);
    }

    //generate columns infos
    columnsInfos.innerHTML = "";
    columnsInfos.style.gridTemplateColumns = 'repeat(' + columns.length + ', 1fr)';

    for (const column of columns) {
        const currColumnInfos = document.createElement(DomElementNameEnum.COLUMN_INFO);
        currColumnInfos.innerText = column.join('\n');
        columnsInfos.appendChild(currColumnInfos);
    }

    // initializes concrete grid
    concreteGrid.flat().forEach((concreteBlock) => {
        concreteBlock.style.backgroundColor = DomElementColorsEnum.BASE_BLOCK;
        concreteBlock.style.border = '1px solid white';

        container.appendChild(concreteBlock);

    });

    await solverFn(rows, columns, concreteGrid);

    return concreteGrid;

}

export async function updateConcreteGrid({
        concreteGrid = concreteGrid,
        grid = [], 
        color = DomElementColorsEnum.ACTIVATED_BLOCK, 
        delayMs = 100,
        activateBlock = true,
        finishGrid =  false
    }) 
{
    
    for (let y = 0; y < concreteGrid.length; y++) {
        for (let x = 0; x < concreteGrid[0].length; x++) {
            const currConcreteBlock = concreteGrid[y][x];
            const currBlock = grid?.[y]?.[x];

            if (finishGrid && currConcreteBlock.style.backgroundColor !== DomElementColorsEnum.BASE_BLOCK) {
                currConcreteBlock.style.backgroundColor = DomElementColorsEnum.FINAL_COLOR;
            }

            else if (currBlock && !currConcreteBlock.activated) {
                currConcreteBlock.style.backgroundColor = color;
                if (activateBlock) currConcreteBlock.activated = true;
            }

            else if (!activateBlock && !currBlock && !currConcreteBlock.activated) {
                currConcreteBlock.style.backgroundColor = DomElementColorsEnum.BASE_BLOCK;
            }
        }
    }

    await delay(delayMs);
}

//todo change permuation wording to arrangement to fit what i previously named it elsewhere
export async function updateRowsPermutationsInfos(rowsPermutations, rowPermutationIndex = 0, y = 0) 
{
    rowsPermutationsInfos.childNodes[y].innerText = rowsPermutations[y].length - rowPermutationIndex;

    y++;

    for (y; y < rowsPermutations.length; y++) {
        rowsPermutationsInfos.childNodes[y].innerText = rowsPermutations[y].length;
    }
}

export async function updateColumnsPermutationsInfos(columnsPermutations, indexesOffset = new Array(columnsPermutations.length).fill(0)) 
{
    for (let i = 0; i < columnsPermutations.length; i++) {
        columnsPermutationsInfos.childNodes[i].innerText = `${columnsPermutations[i].length - indexesOffset[i]}`.split('').join('\n');
    }
}

// await generateVisualization(...buildTestGrid(15), container, nonogramSolver3VisualEdition);
await generateVisualization(...buildTestGrid(15), container, nonogramSolver4VisualEdition);

