import { Readable } from 'node:stream';

class OneToHundredStream extends Readable {
  index = 1;
  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 10) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i)); // Buffer aceita só string, não numbers

        this.push(buf);
      }
    }, 500); // Este timeout emula o que acontece com uma Stream
  }
}

// ENVIA DADOS AOS POUCOS PARA O HTTP SERVER. É A BASE DO PODER DA ARQUITETURA DO NODE (CANAL DE ENVIO DE DADOS QUE FICA ABERTO)
fetch('http://localhost:3335', {
  method: 'POST',
  body: new OneToHundredStream(),
  duplex: 'half',
})
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    console.log(data);
  });
