import { Readable } from 'node:stream';

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

new OneToHundredStream().pipe(process.stdout);
