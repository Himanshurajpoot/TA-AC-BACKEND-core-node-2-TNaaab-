let http = require('http');
let qs = require('querystring');
let server = http.createServer(handleServer);

function handleServer(req, res) {
  let stord = '';
  
  req.on('data', (chunk) => {
    stord += chunk;
  });

  req.on('end', () => {
   if(req.method==="POST" && req.url==="/json"){
    console.log(stord)
    res.setHeader("Content-Type", "application/json")
    res.end(stord)
   }

   if(req.method==="POST" && req.url==="/form"){
    console.log(stord)

    let fromData = qs.parse(stord)
     res.end(JSON.stringify(fromData))
   }

  });
}

server.listen(7000, () => {
  console.log('server is listening on port 7000');
});
