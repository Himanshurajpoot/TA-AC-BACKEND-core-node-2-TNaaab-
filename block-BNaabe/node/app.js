// q 3

let http = require('http');
let qs = require('querystring');
let server_Too = http.createServer(handleRequstToo);

function handleRequstToo(req, res) {
  let stord = '';
  let typeData = req.headers['content-type'];
  req.on('data', (chunk) => {
    stord += chunk;
  });
  req.on('end', () => {
    if (typeData === 'application/json') {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(stord);
    }

    if (typeData === 'application/x-www-form-urlencoded') {
      let parseForm = qs.parse(stord);
      res.end(JSON.stringify(parseForm));
    }
  });
}

server_Too.listen(9000, () => {
  console.log('server is listening on port 9000');
});
