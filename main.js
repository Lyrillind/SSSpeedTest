import { argv } from 'yargs';
import Promise from 'bluebird';
import colors from 'colors';

import { getBLen, padEnd } from './src/util';
import httpTest from './src/httptest';
import parseSSR from './src/parsessr';
import startSSR from './src/startssr';

const GREEN = 100;
const ORANGE = 400;

parseSSR(argv.url)
  .then((servers) => {
    return servers.map((server) => {
      let p;
      return startSSR(server)
        .delay(1000)
        .then((process) => {
          p = process;
          return httpTest(server);
        })
        .finally(() => {
          p.kill('SIGHUP');
        });
    });
  })
  .then((tests) => {
    return Promise.all(tests);
  })
  .then((results) => {
    results.sort((a, b) => getBLen(b.name) - getBLen(a.name));
    const maxLen = getBLen(results[0].name);
    results.sort((a, b) => a.time - b.time);
    results.forEach((item) => {
      let color;
      if (item.time <= GREEN) {
        color = 'green';
      } else if (item.time > GREEN && item.time <= ORANGE) {
        color = 'yellow';
      } else {
        color = 'red';
      }
      const name = padEnd(`${item.name}:`, Math.round(maxLen * 1.5), ' ');
      console.log(`${name}${colors[color](item.time)}`);
    });
  });
