import * as path from 'path';
import test from 'ava';
const Config = require('y-config');

const folderName = process.env.Level === 'deploy' ? '.deploy_test' : '.script_test';
const p = path.resolve(__dirname, '../..', folderName);

test('tsconfig.test.json File Diff Check', (t) => {
    const obj = require(path.resolve(p, 'tsconfig.test.json'));
    t.true(!!~obj.include.indexOf('./lib/**/*'));
    t.false(!!~obj.include.indexOf('./src/**/*'));
});

test('.travis File Diff Check', (t) => {
    const config = new Config();
    config.addConfigPath(path.resolve(p, '.travis.yml'));
    const obj = config.toObject();
    t.is(obj.deploy.email, 'arylo.open+npm@gmail.com');
    t.not(obj.deploy.email, 'arylo.open@gmail.com');
});

test('package.json File Diff Check', (t) => {
    const obj = require(path.resolve(p, 'package.json'));
    t.truthy(obj.yVersion);
});
