import { compact, padEnd } from 'lodash';
import URLSafeBase64 from 'urlsafe-base64';
import axios from 'axios';
import base64 from 'base-64';

function normalizeBase64(code) {
  return padEnd(code, (Math.floor(code.length / 4) + 1) * 4, '=');
}

function decode(code) {
  if (!code) return code;
  try {
    return URLSafeBase64.validate(code) ? URLSafeBase64.decode(code).toString() : base64.decode(normalizeBase64(code));
  } catch (e) {
    return code;
  }
}

function parseExtra(extraString) {
  if (!extraString) return {};
  const extra = {};
  extraString.split('&').forEach((item) => {
    extra[item.split('=')[0]] = decode(item.split('=')[1]);
  });
  return extra;
}

const parseSSR = (url) => {
  return axios.get(url).then((response) => {
    const contents = base64.decode(response.data);
    const servers = contents.split('\n');
    return servers.map((server) => {
      if (server.length <= 0) return null;
      const cyCode = server.replace('ssr://', '');
      const decodedString = decode(cyCode);
      const info = decodedString.split('/?')[0].split(':');
      const extra = parseExtra(decodedString.split('/?')[1]);
      return {
        local_address: '127.0.0.1',
        local_port: Math.floor(Math.random() *  6000 + 14000),
        timeout: 300,
        workers: 1,
        server: info[0],
        server_port: parseInt(info[1]),
        method: info[3],
        password: decode(info[5]),
        obfs: info[4],
        obfs_param: extra.obfsparam,
        protocol: info[2],
        protocol_param: extra.protoparam,
        remarks: extra.remarks,
        group: extra.group,
      };
    });
  }).then(compact).catch((err) => {
    console.error(err);
  });
}

export default parseSSR;
