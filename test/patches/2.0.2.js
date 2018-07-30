import test from 'ava';
import * as fs from 'fs';
import { URL } from 'url';
import * as path from 'path';

const folderName = JSON.parse(process.env.npm_config_argv).remain[0];
const p = path.resolve(__dirname, '../..', folderName);

test('New jsconfig file', (t) => {
    const filepath = path.resolve(p, 'jsconfig.json');
    t.true(fs.existsSync(filepath));
    const obj = require(filepath);
    t.true(obj.compilerOptions.experimentalDecorators);
});

test('Update Readme file', (t) => {
    const content = fs.readFileSync(path.resolve(p, 'README.md'), 'utf-8');
    t.true(/\/master\.svg/.test(
        new URL(content.match(/\[TRAVIS_URL\]:\s*(\S+)\s/)[1]).pathname
    ));
    t.true(/\/master\.svg/.test(
        new URL(content.match(/\[COVERALLS_URL\]:\s*(\S+)\s/)[1]).pathname
    ));
});

test('Update tsconfig.json File', (t) => {
    const obj = require(path.resolve(p, 'tsconfig.json'));
    t.true(obj.compilerOptions.experimentalDecorators);
    t.true(obj.compilerOptions.emitDecoratorMetadata);
});
