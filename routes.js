const fs = require('fs');

function requestHandler(req, res) {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    let body = [];

    req.on('data', (chunk) => {
      body.push(chunk); // chunk = <Buffer 6d 65 73 73 61 67 65 3d 48 65 6c 6c 6f>
    });

    return req.on('end', () => {
      const parseBody = Buffer.concat(body).toString(); // parseBody = 'message=Hello'
      const message = parseBody.split('=')[1];

      fs.writeFile('message.txt', message, err => {
        // Redirect
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1>Hello World !</h1></body>');
  res.write('</html>');
  res.end();
}

module.exports = requestHandler;