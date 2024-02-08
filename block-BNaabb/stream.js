let http = require("http")

let server = http.createServer(handleRequst)

function handleRequst(req, res){
    let store = ''
    req.on("data", (chunk)=>{
       store+=chunk
    })

    req.on("end", ()=>{
        console.log(store)
        res.write(store)
        res.end()
    })
}

server.listen(3456, ()=>{
    console.log("server is listening on port 3456")
})