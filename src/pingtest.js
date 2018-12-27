import ping from 'ping';

function pingTest(server) {
  return ping.promise.probe(server)
    .then((res) => {
      console.log(server, res);
    });
}

export default pingTest;
