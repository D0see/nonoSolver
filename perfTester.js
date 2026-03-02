import { solveNonogram } from './solver.js';

console.time('easy');

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
console.timeEnd('easy');

console.time('medium');

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
console.timeEnd('medium');

console.time('hard')

console.log(solveNonogram(
        [
            [1, 1],
            [1 ,1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 2],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1]
        ], 
        [
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [2, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1]
        ]
    )
);

console.timeEnd('hard')

console.time('very hard')

console.log(solveNonogram(
        [
            [1, 2, 2],
            [1 ,1],
            [4, 1],
            [5, 2],
            [3, 2],
            [1, 3],
            [1, 8],
            [1],
            [8],
            [2, 1]
        ], 
        [
            [5, 1, 1],
            [4, 1],
            [1, 3, 1, 1],
            [1, 2, 1, 1],
            [1, 1, 1],
            [3],
            [1, 2, 2],
            [1, 2, 2],
            [1, 1, 3],
            [2, 1, 1, 1]
        ]
    )
);

console.timeEnd('very hard')

