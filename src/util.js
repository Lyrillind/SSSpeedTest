function getBLen(str) {
  if (str == null) return 0;
  if (typeof str != "string"){
    str += "";
  }
  return str.replace(/[^\x00-\xff]/g,"01").length; // eslint-disable-line no-control-regex
}

function padEnd(src, len, placeholder) {
  const srcLen = getBLen(src);
  if (srcLen < len) {
    let padstring = '';
    for (let i = 0; i < len - srcLen; i++) {
      padstring = `${padstring}${placeholder}`;
    }
    return `${src}${padstring}`;
  } else {
    return src;
  }
}

export default {
  getBLen,
  padEnd,
};
