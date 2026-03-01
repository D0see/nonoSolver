import { solveNonogram as solveNonogram1 } from './solverv1.js';
import { solveNonogram as solveNonogram2 } from './solverv2.js';
import { solveNonogram as solveNonogram3 } from './solverv3.js';

console.time(1);
console.log(solveNonogram1(
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
console.timeEnd(1);

console.time(2);
console.log(solveNonogram2(
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
console.timeEnd(2);

console.time(3);
console.log(solveNonogram3(
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
console.timeEnd(3);

// console.log(solveNonogram(
//         [
//             [1, 1],
//             [1 ,1],
//             [1, 1],
//             [1, 1],
//             [1, 1],
//             [1, 2],
//         ], 
//         [
//             [1, 1],
//             [1, 1],
//             [1, 1],
//             [1, 1],
//             [1, 1],
//             [2, 1]
//         ]
//     )
// );

// console.log(solveNonogram(
//         [
//             [1, 1],
//             [1 ,1],
//             [1, 1],
//             [1, 1],
//             [1, 1],
//             [1, 2],
//             [1, 1],
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
//             [2, 1],
//             [1, 1],
//             [1, 1],
//             [1, 1],
//             [1, 1]
//         ]
//     )
// );
