import http from 'node:http';
import { Transform } from 'node:stream';

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    console.log(transformed);

    callback(null, Buffer.from(String(transformed)));
  }
}

// TUDO NO NODE SÃO STREAMS (req Readable, res Writable são streams internas do node):
const server = http.createServer(async (req, res) => {
  const buffers = [];

  // percorrendo cada pedacinho da requisição para criar uma stream COMPLETA
  for await (const chunk of req) {
    buffers.push(chunk);
  } // Consome toda a informação antes de seguir os comandos abaixo
  // Tem dados, como o JSON, que não dá pra consumir por pedaços
  // Por isso o consumo de stream é voltado mais para dados consumíveis de forma PARCIAL

  const fullStreamContent = Buffer.concat(buffers).toString();

  console.log(fullStreamContent);

  return res.end(fullStreamContent);

  // return req
  //   .pipe(new InverseNumberStream())
  //   .pipe(res)
});

server.listen(3335);
