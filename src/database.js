import fs from 'node:fs/promises'; // para stream, não dá pra fazer com /promises
import { URL } from 'node:url';

const databasePath = new URL('../db.json', import.meta.url); // para deixar a rota relativa a este arquivo e não criar outros db.json pelo projeto
// console.log(databasePath);

// BANCO DE DADOS CRIADO:
export class Database {
  #database = {};

  constructor() {
    // ao ser instanciada, a classe roda a leitura do nosso banco:
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data);
      }) // caso não exista:
      .catch(() => { // chama o persist pra criá-lo:
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile('db.json', JSON.stringify(this.#database));
  }

  select(table) {
    const data = this.#database[table] ?? [];

    return data;
  }

  insert(table, data) {
    // se já existe array:
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }
}
