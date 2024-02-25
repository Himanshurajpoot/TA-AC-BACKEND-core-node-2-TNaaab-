let http = require('http');
let fs = require('fs');
let qs = require('querystring');
let server = http.createServer(handleRequest);
let path = __dirname + '/contects/';
let url = require('url');

function handleRequest(req, res) {
  let parseUrl = url.parse(req.url, true);

  let store = '';
  req.on('data', (chunk) => {
    store += chunk;
  });

  req.on('end', () => {
    if (req.method === 'GET' && req.url === '/') {
      fs.readFile('./index.html', (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    }else if (req.method === 'GET' && req.url === '/about') {
      fs.readFile('./about.html', (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    }else if (req.url.split('.').pop() === 'css') {
      res.setHeader('Content-Type', 'text/css');
      fs.readFile('./assets/' + req.url, (err, contect) => {
        if (err) return console.log(err);
        res.end(contect);
      });
    }else if (req.url.split('.').pop() === 'jpg') {
      res.setHeader('Content-Type', 'image/jpg');
      fs.readFile('./assets/' + req.url, (err, content) => {
        if (err) return console.log(err);
        res.end(content);
      });
    }else if (req.url === '/contact' && req.method === 'GET') {
      fs.readFile('./contact.html', (err, contect) => {
        if (err) return console.log(err);
        res.end(contect);
      });
    }else if (req.url === '/form' && req.method === 'POST') {
      let userName = qs.parse(store).username;
      let parseData = qs.parse(store);
      fs.open(path + userName + '.json', 'wx', (err, fd) => {
        if (err) return console.log(err, `username taken`);
        fs.writeFile(fd, JSON.stringify(parseData), (err) => {
          if (err) return console.log(err);
          fs.close(fd, (err) => {
            if (err) return console.log(err);
            res.setHeader('Contect-Type', 'text/html');
            res.end(`${userName} contacts saved`);
          });
        });
      });
    }else if (parseUrl.pathname === '/user' && req.method === 'GET') {
      fs.open(path + parseUrl.query.username + '.json', 'r+', (err, fd) => {
        if (err) return console.log(err);
        fs.readFile(fd, (err, content) => {
          if (err) return console.log(err);
          fs.close(fd, (err) => {
            if (err) return console.log(err);
            res.setHeader('Content-Type', 'text/html');
            res.end(content);
          });
        });
      });
    }else if (req.url === '/users' && req.method === 'GET') {
      fs.readdir(path, (err, files) => {
        if (err) {
          console.error(err);
          res.statusCode = 500; // Internal Server Error
          res.end('Internal Server Error');
          return;
        }

        // Use Promise.all to read all files asynchronously
        Promise.all(
          files.map((file) => {
            return new Promise((resolve, reject) => {
              fs.readFile(path + file, (err, content) => {
                if (err) {
                  console.error(err);
                  reject(err);
                } else {
                  resolve(content);
                }
              });
            });
          })
        )
          .then((contents) => {
            // Set the response header
            res.setHeader('Content-Type', 'text/html');
            // Join all file contents and send as a single response
            res.end(contents.join('\n\n')); // Separate file contents with newlines
          })
          .catch((error) => {
            // Handle any errors that occurred during file reading
            console.error(error);
            res.statusCode = 500; // Internal Server Error
            res.end('Internal Server Error');
          });
      });
    }else{
        res.statusCode=404
        res.end("page not found")
    }

    
  });
}

server.listen(5000, () => {
  console.log('server is listing on port 5k');
});





// this code are modifing


// const http = require('http');
// const fs = require('fs');
// const qs = require('querystring');
// const server = http.createServer(handleRequest);
// const path = __dirname + '/contects/';
// const url = require('url');

// function handleRequest(req, res) {
//   const parseUrl = url.parse(req.url, true);

//   let store = '';
//   req.on('data', (chunk) => {
//     store += chunk;
//   });

//   req.on('end', () => {
//     if (req.method === 'GET' && req.url === '/') {
//       fs.readFile('./index.html', (err, content) => {
//         if (err) {
//           console.error(err);
//           res.statusCode = 500;
//           res.end('Internal Server Error');
//           return;
//         }
//         res.end(content);
//       });
//     } else if (req.method === 'GET' && req.url === '/about') {
//       fs.readFile('./about.html', (err, content) => {
//         if (err) {
//           console.error(err);
//           res.statusCode = 500;
//           res.end('Internal Server Error');
//           return;
//         }
//         res.end(content);
//       });
//     } else if (req.url.endsWith('.css')) {
//       res.setHeader('Content-Type', 'text/css');
//       fs.readFile('./assets' + req.url, (err, content) => {
//         if (err) {
//           console.error(err);
//           res.statusCode = 404;
//           res.end('Not Found');
//           return;
//         }
//         res.end(content);
//       });
//     } else if (req.url.endsWith('.jpg')) {
//       res.setHeader('Content-Type', 'image/jpeg');
//       fs.readFile('./assets' + req.url, (err, content) => {
//         if (err) {
//           console.error(err);
//           res.statusCode = 404;
//           res.end('Not Found');
//           return;
//         }
//         res.end(content);
//       });
//     } else if (req.url === '/contact' && req.method === 'GET') {
//       fs.readFile('./contact.html', (err, content) => {
//         if (err) {
//           console.error(err);
//           res.statusCode = 500;
//           res.end('Internal Server Error');
//           return;
//         }
//         res.end(content);
//       });
//     } else if (req.url === '/form' && req.method === 'POST') {
//       const userName = qs.parse(store).username;
//       const parseData = qs.parse(store);
//       fs.writeFile(path + userName + '.json', JSON.stringify(parseData), { flag: 'wx' }, (err) => {
//         if (err) {
//           console.error(err);
//           res.statusCode = 400;
//           res.end('Bad Request: Username taken or invalid data');
//           return;
//         }
//         res.setHeader('Content-Type', 'text/html');
//         res.end(`${userName} contacts saved`);
//       });
//     } else if (parseUrl.pathname === '/user' && req.method === 'GET') {
//       const username = parseUrl.query.username;
//       fs.readFile(path + username + '.json', (err, content) => {
//         if (err) {
//           console.error(err);
//           res.statusCode = 404;
//           res.end('Not Found');
//           return;
//         }
//         res.setHeader('Content-Type', 'application/json');
//         res.end(content);
//       });
//     } else if (req.url === '/users' && req.method === 'GET') {
//       fs.readdir(path, (err, files) => {
//         if (err) {
//           console.error(err);
//           res.statusCode = 500;
//           res.end('Internal Server Error');
//           return;
//         }

//         Promise.all(files.map((file) => {
//           return new Promise((resolve, reject) => {
//             fs.readFile(path + file, (err, content) => {
//               if (err) {
//                 console.error(err);
//                 reject(err);
//               } else {
//                 resolve(content);
//               }
//             });
//           });
//         }))
//           .then((contents) => {
//             res.setHeader('Content-Type', 'text/html');
//             res.end(contents.join('\n\n'));
//           })
//           .catch((error) => {
//             console.error(error);
//             res.statusCode = 500;
//             res.end('Internal Server Error');
//           });
//       });
//     } else {
//       res.statusCode = 404;
//       res.end("Page not found");
//     }
//   });
// }

// server.listen(5000, () => {
//   console.log('Server is listening on port 5000');
// });

