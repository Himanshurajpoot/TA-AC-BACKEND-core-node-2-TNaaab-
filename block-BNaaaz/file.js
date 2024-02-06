let http = require('http')
let fs = require("fs")

let server = http.createServer(handleRequst)

function handleRequst(req , res){
    console.log(req.url,req.method)
    res.setHeader("Content-Type", "text/html")
    fs.createReadStream("./readme.txt").pipe(res)
}

server.listen(4000, ()=>{
    console.log("server is listening on port 4000")
})