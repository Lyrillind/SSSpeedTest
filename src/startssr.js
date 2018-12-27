import Promise from 'bluebird';
import child_process from 'child_process';
import fs from 'fs-extra';
import path from 'path';

const SS_LOCAL = path.resolve(__dirname, '../ss-local');

function startServer(config) {
  const cacheDir = path.resolve(__dirname, './cache')
  fs.ensureDirSync(cacheDir);
  const configPath = path.join(cacheDir, `${Math.floor(Math.random() * 10000)}.json`);
  return new Promise((resolve, reject) => {
    fs.writeJson(configPath, config)
      .then(() => child_process.spawn(SS_LOCAL, ['-c', configPath]))
      .then((process) => {
        fs.remove(configPath);
        return process;
      })
      .then(resolve)
      .catch(reject);
  });
}

export default startServer;
