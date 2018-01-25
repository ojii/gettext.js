import {readFileSync} from 'fs';
import {join} from 'path';
import http from 'http';
import parse from '../src/parser';
import {b2ab} from '../src/utils';

export function readFile(name) {
  return readFileSync(join(__dirname, 'data', name));
}

export function readArrayBuffer(name) {
  return b2ab(readFile(name));
}

export function readCatalog(name) {
  return parse(readArrayBuffer(name));
}

export function withServer(cb) {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      res.end(readFile(req.url));
    });
    server.listen(0, async () => {
      await cb(path => `http://localhost:${server.address().port}${path}`);
      server.close();
      resolve();
    })
  });
}
