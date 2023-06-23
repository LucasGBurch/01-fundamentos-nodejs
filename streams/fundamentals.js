import { Readable, Writable, Transform } from 'node:stream';

// stream de LEITURA: Lá embaixo usa .pipe(process.stdout); para escrever
class OneToHundredStream extends Readable {
  index = 1;
  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 100) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i)); // Buffer aceita só string, não numbers

        this.push(buf);
      }
    }, 500); // Este timeout emula o que acontece com uma Stream
  }
}

// stream de escrita (processa os dados), usada sem o inverse criado depois, além de ler os dados antes do pipe. Ou seja, é intermediária na comunicação entre Readable e Writable
class MultiplyByTenStream extends Writable {
  //(pedaço/buffer lido, como a informação tá codificada, função que a stream precisa chamar quando terminou de fazer o que precisava)
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10);
    callback();
  } // Lê os dados do Readable, converte para number e multiplica por 10
}

// stream de transformação (usa o pipe do Writable no final tb):
class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1; // transforma em negativo;

    callback(null, Buffer.from(String(transformed))); // Manda null caso não ter dado erro (dava pra ser um new Error dentro de um if para tratar erros)
  }
}

new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream());
