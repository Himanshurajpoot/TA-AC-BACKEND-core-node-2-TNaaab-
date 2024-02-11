let http = require('http');
let fs = require('fs');
let qs = require('querystring');

// Q-2
let server = http.createServer(handleRequst);
function handleRequst(req, res) {
  res.setHeader('Content-Type', 'text/html');
  fs.createReadStream('./form.html').pipe(res);
}

server.listen(4000, () => {
  console.log('server is listening on port 4000');
});

// Q-3
let serverToo = http.createServer(handleRequstToo);

function handleRequstToo(req, res) {
  // if any request is made then event is also called
  // and event also check  req carrying data or not
  let stord = '';
  req.on('data', (chunk) => {
    stord += chunk;
  });

  req.on('end', () => {
    if (req.method === 'GET' && req.url === '/form') {
      console.log(req.method)
      console.log(stord + "khali")
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('./form.html').pipe(res);
    }

    if (req.method === 'POST' && req.url === '/form') {
      console.log(req.method)
      console.log(stord)

      let parshData = qs.parse(stord);
      res.setHeader('Content-Type', 'text/html');
      res.write(`<h1>${parshData.name}</h1>`);
      res.write(`<h2>${parshData.email}</h2>`);
      res.write(`<p>${parshData.age}</p>`);
      res.end();
    }
  });
}

serverToo.listen(5678, () => {
  console.log('serverToo is listening on port 5678');
});
