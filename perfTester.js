import { solveNonogram } from './solver.js';
import { buildTestGrid } from './generator.js';

for (let i = 2; i < 20; i++) {
    const [rows, columns] = buildTestGrid(i);

    console.time('size ' + i);

    console.log(rows, columns)

    console.log(
        solveNonogram(rows, columns)
    );

    console.timeEnd('size ' + i);
}