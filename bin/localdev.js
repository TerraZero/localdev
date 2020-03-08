#!/usr/bin/env node

const FS = require('fs');
const Path = require('path');
const FindJson = require('find-package-json');
const pack = require(Path.join(process.cwd(), '/package.json'));

function installDependencies(path, ...packages) {
  for (const pack of packages) {
    console.log('Install local package: ' + Path.join(path, pack));
    FS.symlinkSync(Path.join(path, pack), Path.join('./node_modules/' + pack), 'dir');
  }
}

function uninstallDependencies(...packages) {
  for (const pack of packages) {
    if (FS.existsSync(Path.join('./node_modules/' + pack))) {
      console.log('Uninstall local package: ' + pack);
      FS.unlinkSync(Path.join('./node_modules/' + pack));
    }
  }
}

switch (process.argv[2]) {
  case 'install':
    console.log('Link local module');
    const packdir = Path.dirname(FindJson(process.cwd()).next().filename);

    FS.symlinkSync(packdir, './node_modules/' + pack.name, 'dir');
    installDependencies(Path.join(packdir, '..'), ...process.argv.slice().splice(3));
    break;
  case 'uninstall':
    if (FS.existsSync(Path.join('node_modules/', pack.name))) {
      console.log('Unlink local module');
      FS.unlinkSync(Path.join('node_modules/', pack.name));
    }
    uninstallDependencies(...process.argv.slice().splice(3));
    break;
  default:
    console.error('please use "install" or "uninstall"');
    break;
}
