const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = 8080;

function getPath(url) {
  if(url === "/") {
    return "/public/index.html"; 
  }
  
  // MAB tests
  if(url === "/live" || url === "/live/") {
    return "/public/live/index.html"; 
  }

  // MAB tests
  if(url === "/local" || url === "/local/") {
    return "/public/local/index.html"; 
  }
  
  if(url === "/subfol" || url === "/subfol/") {
    return "/public/subfol/index.html"; 
  }
  
  if(url === "/framed" || url === "/framed/") {
    return "/public/framed/index.html"; 
  }
  
  if(url === "/9789" || url === "/9789/") {
    return "/public/9789/index.html"; 
  }

  // MSM tests
  if(url === "/9680" || url === "/9680/") {
    return "/public/9680/index.html"; 
  }

  return "/public/" + url;
}

function getContentType(url) {
  if(url.endsWith("/")) {
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
  const proxyURLs = getProxy(req.url);

  const path = getPath(req.url);
  const type = getContentType(req.url);

  fs.readFile(__dirname + path)
    .then(contents => {
        res.setHeader("Content-Type", type);
        res.writeHead(200);
        res.end(contents);
    }).catch(err => {
      res.writeHead(500);
      return;
  });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});