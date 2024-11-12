const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = 8000;

function getPath(url) {
  console.log(`getPth`, url);

  if(url === "/") {
    return "/public/index.html"; 
  }

  return "/public/" + url;
}

function getContentType(url) {
  if(url === "/") {
    return "text/html"; 
  }

  if(url.endsWith(".css")) {
    return "text/css";
  } else if (url.endsWith(".js")) {
    return "application/javascript";
  } else if (url.endsWith(".html")) {
    return "text/html";
  } else if(url.endsWith(".ico")) {
    return "image/x-icon";
  } else {
    return "text/plain";
  }
}

const requestListener = function (req, res) {
  const path = getPath(req.url);
  const type = getContentType(req.url);
  console.log(req.url, type);

  fs.readFile(__dirname + path)
    .then(contents => {
        res.setHeader("Content-Type", type);
        res.writeHead(200);
        res.end(contents);
    }).catch(err => {
      res.writeHead(500);
      // res.end(err);
      return;
  });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});