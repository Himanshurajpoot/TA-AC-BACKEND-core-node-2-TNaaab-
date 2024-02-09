// Q 1
let path = require('path');
console.log(__filename);
console.log(__dirname + '/app.js');
console.log('./index.html');

let indexPath = path.join(__dirname + '/index.html');
console.log(indexPath);

// Q-2

let http = require('http');
let qs = require('querystring');


let server = http.createServer(handleRequst);

function handleRequst(req, res) {
  let stord = '';
  let typeData = req.headers['content-type'];
  req.on('data', (chunk) => {
    stord += chunk;
  });
  req.on('end', () => {
    if (req.method === 'POST' && req.url === '/') {
      if (typeData === 'application/json') {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(stord);
      }

      if (typeData === 'application/x-www-form-urlencoded') {
        let parseForm = qs.parse(stord);
        res.setHeader('Content-Type', 'text/plain');
        res.end(parseForm.captain);
      }
    }
  });
}

server.listen(4000, () => {
  console.log('server is listening on port 4000');
});


// Q-4

let server4 = http.createServer(handleRequstFour)

function handleRequstFour(req, res){
let stord =""
    req.on("data",(chunk)=>{
       stord+=chunk
    })

    req.on("end",()=>{
        if(req.headers["content-type"]==='application/json'){
            let parsejson = JSON.parse(stord)
            res.setHeader("Content-Type", "text/html")
            res.write(`<h1>${parsejson.name}</h1>`)
            res.write(`<h2>${parsejson.email}</h2>`)
            res.end()
        }

        if(req.headers["content-type"]==='application/x-www-form-urlencoded'){
            let parseform = qs.parse(stord);
            res.setHeader('Content-Type', 'text/html');
            res.end(`<h2>${parseform.email}</h2>`);
        }
   
    })
}

server4.listen(5000,()=>{
    console.log("server4 is listing on port 5000")
})



