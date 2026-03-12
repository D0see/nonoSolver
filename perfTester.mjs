import { solveNonogram as solver4 } from './solver4.mjs';
import { solveNonogram as solver3 } from './solver3.mjs';
import { solveNonogram as solver2 } from './solver2.mjs';
import { solveNonogram as solver1} from './solver1.mjs';
import { buildTestGrid } from './generator.mjs';

for (let i = 2; i <= 15; i++) {
    console.log(i);

    const data = [0, 0, 0, 0];
    for (let j = 0; j < 1; j++) {

        const [rows, columns] = buildTestGrid(i);

        const start4 = performance.now();
        solver4(rows, columns);
        const end4 = performance.now();
        data[3] += end4 - start4;

        const start3 = performance.now();
        solver3(rows, columns);
        const end3 = performance.now();
        data[2] += end3 - start3;

        // const start2 = performance.now();
        // solver2(rows, columns);
        // const end2 = performance.now();
        // data[1] += end2 - start2;

        // const start1 = performance.now();
        // solver1(rows, columns);
        // const end1 = performance.now();
        // data[0] += end1 - start1;
    }

    console.log(data.map(Math.round).join('-'))
}

// const [rows, columns] = buildTestGrid(14);

// console.log(rows);
// console.log(columns);
