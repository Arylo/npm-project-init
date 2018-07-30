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

const folderName = process.env.Level === 'deploy' ? '.deploy_test' : '.script_test';

test('File Count', (t) => {
    const dirCount = glob.sync(
        `../${folderName}/!(.git){,/**}`, globOptions
    ).length;
    t.is(rawCount, dirCount);
});
