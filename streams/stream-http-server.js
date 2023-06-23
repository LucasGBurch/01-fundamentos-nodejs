import http from 'node:http';
import { Transform } from 'node:stream';

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    console.log(transformed)

    callback(null, Buffer.from(String(transformed)));
  }
}

// TUDO NO NODE SÃO STREAMS (req Readable, res Writable são streams internas do node):
const server = http.createServer((req, res) => {
  return req
    .pipe(new InverseNumberStream())
    .pipe(res)
});

server.listen(3335);