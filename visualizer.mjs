import { generateGrid } from "./generator.mjs";
import { DomElementNameEnum } from './DomElementNameEnum.mjs';
import { DomElementColorsEnum } from "./DomElementColorsEnum.mjs";
import { solveNonogram } from './solver3visualization.mjs';
import { delay } from './utils.mjs'

const container = document.getElementById(DomElementNameEnum.GRID);

function generateVisualization(
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
        concreteBlock.style.border = '1px solid black';

        container.appendChild(concreteBlock);

    });

    solverFn(rows, columns, concreteGrid);

    return concreteGrid;

}

export async function updateConcreteGrid(
    concreteGrid,
    grid, 
    color = DomElementColorsEnum.ACTIVATED_BLOCK, 
    delayMs = 500,
    activateBlock = true
) {
    for (let y = 0; y < concreteGrid.length; y++) {
        for (let x = 0; x < concreteGrid[0].length; x++) {
            const currConcreteBlock = concreteGrid[y][x];
            const currBlock = grid?.[y]?.[x];

            if (currBlock && !currConcreteBlock.activated) {
                currConcreteBlock.style.backgroundColor = color;
                if (activateBlock) currConcreteBlock.activated = true;
            }

            if (!activateBlock && !currBlock && !currConcreteBlock.activated) {
                currConcreteBlock.style.backgroundColor = DomElementColorsEnum.BASE_BLOCK;
            }
        }
    }

    await delay(delayMs);
}

// generateVisualization(
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
//     ],
//     container, 
//     solveNonogram
// );

generateVisualization(
[
    [ 1, 3, 2 ],       [ 1, 2 ],
    [ 3, 1, 4, 1 ],    [ 4, 3, 1 ],
    [ 1, 1, 1, 2, 1 ], [ 2, 7, 1 ],
    [ 1, 2, 1, 5 ],    [ 2, 8 ],
    [ 1, 2 ],          [ 4, 1, 2, 1 ],
    [ 1, 3, 1, 3 ],    [ 1, 2, 1, 3 ],
    [ 3, 1, 2, 1 ],    [ 4, 1, 3 ]
], [
    [ 1, 3, 2 ],       [ 2, 1, 1, 2, 2 ],
    [ 1, 1, 1, 2, 3 ], [ 1, 3, 1 ],
    [ 1, 2, 2 ],       [ 1, 4, 2 ],
    [ 1, 1, 3, 1 ],    [ 1, 7 ],
    [ 1, 1, 1, 1, 3 ], [ 1, 2, 3, 1, 1 ],
    [ 6, 3 ],          [ 2, 5, 1, 2 ],
    [ 2, 2, 1, 1 ],    [ 6, 2, 1 ]
    ],
container, 
solveNonogram
);