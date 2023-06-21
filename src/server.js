import http from 'node:http';

const server = http.createServer((req, res) => {
  const { method, url } = req; 
  
  // Padrão seria GET e '/'  // console.log(method, url) mostra

  if (method === 'GET' && url === '/users') {
    return res.end('Listagem de usuários');
  }

  if (method === 'POST' && url === '/users') {
    
    return res.end('Criação de usuário');
  }

  return res.end('Hello World');
});

server.listen(3334);
