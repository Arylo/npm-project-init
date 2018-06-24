import test from 'ava';
import * as glob from 'glob';

const globOptions = {
    cwd: __dirname,
    nodir: true,
    dot: true
};

let rawCount;

test.before(() => {
    rawCount = glob.sync('../public/**', globOptions).length;
});

test('Bin File Count', (t) => {
    const dirCount = glob.sync('../dist/public/**', globOptions).length;
    t.is(rawCount, dirCount - 1);
});

test('Dist File Count', (t) => {
    const dirCount = glob.sync(
        '../.script_test/!(.git){,/**}', globOptions
    ).length;
    t.is(rawCount, dirCount);
});

test('Deploy File Count', (t) => {
    const dirCount = glob.sync(
        '../.deploy_test/!(.git){,/**}', globOptions
    ).length;
    t.is(rawCount, dirCount);
});
