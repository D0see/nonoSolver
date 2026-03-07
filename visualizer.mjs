import { generateGrid } from "./generator.mjs";
import { DomElementNameEnum } from './DomElementNameEnum.mjs';
import { DomElementColorsEnum } from "./DomElementColorsEnum.mjs";
import { solveNonogram } from './solver3visualization.mjs';
import { delay } from './utils.mjs'

const container = document.getElementById(DomElementNameEnum.GRID);

const concreteGrid = generateGrid(
    10, 10, () => document.createElement(DomElementNameEnum.CONCRETE_BLOCK)
);

//initilizes concrete grid
concreteGrid.flat().forEach((concreteBlock) => {
    concreteBlock.style.backgroundColor = DomElementColorsEnum.BASE_BLOCK;
    concreteBlock.style.border = '1px solid black';

    container.appendChild(concreteBlock);

});

export async function updateConcreteGrid(
    grid, 
    color = DomElementColorsEnum.ACTIVATED_BLOCK, 
    delayMs = 500,
    activateBlock = true
) {
    console.table(grid);
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            const currConcreteBlock = concreteGrid[y][x];
            const currBlock = grid[y][x];

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
// );

solveNonogram(
    [
        [ 2, 1, 3 ],    [ 3, 2 ],   
        [ 1, 1, 2 ],    [ 1, 1, 2 ],
        [ 1, 1, 1, 3 ], [ 1, 1, 1 ],
        [ 5 ],          [ 1, 3, 1 ],
        [ 6, 2 ],       [ 2, 2, 1 ] 
    ],
    [
        [ 1, 4, 1 ], [ 2, 4 ],      
        [ 2, 2, 2 ], [ 1, 1, 3 ],   
        [ 4 ],       [ 1, 1, 3 ],   
        [ 3, 1 ],    [ 2, 1, 1 ],   
        [ 1, 3, 1 ], [ 1, 3, 2 ]    
    ],
    
);