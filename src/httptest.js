import SocksProxyAgent from 'socks-proxy-agent';
import http from 'http';
import url from 'url';

const TEST_URL = 'http://www.gstatic.com/generate_204';

function httpTest(server) {
  return new Promise((resolve, reject) => {
    const proxyOptions = `socks5://127.0.0.1:${server.local_port}`;

    const opts = url.parse(TEST_URL);
    opts.agent = new SocksProxyAgent(proxyOptions);
    opts.timeout = 10 * 1000;
    const start = Date.now();
    http.get(opts, (res) => {
      const { statusCode } = res;
      if (statusCode >= 400) {
        res.resume();
      } else {
        resolve({
          name: server.remarks,
          time: Date.now() - start,
        });
      }
    }).on('error', reject);
  }).catch((err) => ({
    err,
    name: server.remarks,
    time: Infinity,
  }));
}

export default httpTest;
