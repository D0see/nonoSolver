import { solveNonogram as solver3 } from './solver3.mjs';
import { solveNonogram as solver2 } from './solver2.mjs';
import { solveNonogram as solver1} from './solver1.mjs';
import { buildTestGrid } from './generator.mjs';

for (let i = 2; i <= 20; i++) {
    console.log(i);
    const [rows, columns] = buildTestGrid(i);

    console.time('3- ' + i);

    solver3(rows, columns)

    console.timeEnd('3- ' + i);
    
    console.time('2- ' + i);
    
    solver2(rows, columns)

    console.timeEnd('2- ' + i);

    console.time('1- ' + i);
    
    solver1(rows, columns)

    console.timeEnd('1- ' + i);

}

// const [rows, columns] = buildTestGrid(14);

// console.log(rows, columns);

// const [rows, columns] = buildTestGrid(14);

// console.log(rows);
// console.log(columns);
