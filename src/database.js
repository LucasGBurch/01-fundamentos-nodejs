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
      .catch(() => {
        // chama o persist pra criá-lo:
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile('db.json', JSON.stringify(this.#database));
  }

  // GET
  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        // entries cria um Array para cada item dentro de outro Array. Ex: [1, 2] => [[1], [2]]
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  // POST
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

  // PUT
  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      // findIndex retorna -1 se não encontra
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist(); // persiste se encontra
    }
  }

  // DELETE
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      // findIndex retorna -1 se não encontra
      this.#database[table].splice(rowIndex, 1);
      this.#persist(); // persiste se encontra
    }
  }
}
