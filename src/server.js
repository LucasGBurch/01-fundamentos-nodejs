import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res); // espera rodar este middleware ("interceptador da req acima") antes de prosseguir;

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url); // toda RegExp tem um método test()
  });

  if (route) {
    // para executar a RegExp na url para retornar os dados encontrados:
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    // console.log(extractQueryParams(query));

    req.params = params;
    req.query = query ? extractQueryParams(query) : {}; // só pra não ficar undefined se não tiver query

    // console.log(routeParams);

    return route.handler(req, res);
  }

  // console.log(route);

  return res.writeHead(404).end();
});

server.listen(3334);
