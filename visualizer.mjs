import { generateGrid, buildTestGrid } from "./generator.mjs";
import { DomElementNameEnum } from './DomElementNameEnum.mjs';
import { DomElementColorsEnum } from "./DomElementColorsEnum.mjs";
import { solveNonogram as nonogramSolver3VisualEdition } from './solver3visualization.mjs';
import { delay } from './utils.mjs'

const container = document.getElementById(DomElementNameEnum.GRID);

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

    // initializes concrete grid
    concreteGrid.flat().forEach((concreteBlock) => {
        concreteBlock.style.backgroundColor = DomElementColorsEnum.BASE_BLOCK;
        concreteBlock.style.border = '1px solid white';

        container.appendChild(concreteBlock);

    });

    await solverFn(rows, columns, concreteGrid);

    // await updateConcreteGrid({
    //         concreteGrid : concreteGrid,
    //         finishGrid :  true
    // });

    return concreteGrid;

}

export async function updateConcreteGrid({
        concreteGrid = concreteGrid,
        grid = [], 
        color = DomElementColorsEnum.ACTIVATED_BLOCK, 
        delayMs = 500,
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

await generateVisualization(...buildTestGrid(20), container, nonogramSolver3VisualEdition);