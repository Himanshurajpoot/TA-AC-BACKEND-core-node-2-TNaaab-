let http = require('http');
let fs = require('fs');
let url = require('url');

let server = http.createServer(handleRequst);
let userDir = __dirname + '/users/';

function handleRequst(req, res) {
  let parseUrl = url.parse(req.url, true);

  let stored = '';
  req.on('data', (chunk) => {
    stored += chunk;
  });

  req.on('end', () => {
    //handle all routes
    if (req.method === 'POST' && req.url === '/users') {
      let createUsername = JSON.parse(stored).username;
      return fs.open(userDir + createUsername + '.json', 'wx', (err, fd) => {
        if (err) return console.log(err);
        fs.writeFile(fd, stored, (err) => {
          if (err) return console.log(err);
          fs.close(fd, (err) => {
            if (err) return console.log(err);
            res.end(`${createUsername} successfully created`);
          });
        });
      });
    }

    if (req.method === 'GET' && parseUrl.pathname === `/users`) {
      return fs.readFile(
        userDir + parseUrl.query.username + '.json',
        (err, user) => {
          if (err) return console.log(err);
          res.setHeader('Content-Type', 'application/json');
          res.end(user);
        }
      );
    }

    if (req.method === 'PUT' && parseUrl.pathname === `/users`) {
      return fs.open(
        userDir + parseUrl.query.username + '.json',
        'r+',
        (err, fd) => {
          if (err) console.log(err);
          fs.ftruncate(fd, (err) => {
            if (err) return console.log(err);
            console.log('Old File Content Deleted');
            fs.writeFile(fd, stored, (err) => {
              if (err) return console.log(err);
              console.log('New File Content Updated');
              fs.close(fd, (err) => {
                if (err) return console.log(err);
                res.end(`${parseUrl.query.username} successfully updeted`);
              });
            });
          });
        }
      );
    }

    if (req.method === 'DELETE' && parseUrl.pathname === `/users`) {
      return fs.unlink(userDir + parseUrl.query.username + '.json', (err) => {
        if (err) return console.log(err);
        res.end(`${parseUrl.query.username} is deleted`);
      });
    }

    res.statusCode = 404;
    res.end(`page not found`);
  });
}

server.listen(4000, () => {
  console.log('server is listing on port 4000');
});
