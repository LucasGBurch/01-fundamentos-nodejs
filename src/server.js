import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res); // espera rodar este middleware ("interceptador da req acima") antes de prosseguir;

  const route = routes.find((route) => {
    return route.method === method && route.path === url;
  });

  if (route) {
    return route.handler(req, res);
  }

  console.log(route);

  return res.writeHead(404).end();
});

server.listen(3334);
