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

const folderName = JSON.parse(process.env.npm_config_argv).remain[0];

test('File Count', (t) => {
    const dirCount = glob.sync(
        `../${folderName}/!(.git){,/**}`, globOptions
    ).length;
    t.is(rawCount, dirCount);
});
