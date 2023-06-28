const http = require("http");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads");

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const httpServer = http.createServer();

httpServer.on("listening", () => {
  console.log("Listening...");
});

httpServer.on("request", (req, res) => {
  if (req.url === "/") {
    const indexPath = path.join(__dirname, "index.html");
    const readStream = fs.createReadStream(indexPath);
    readStream.pipe(res);
  } else if (req.url === "/upload") {
    const fileName = req.headers["file-name"];
    const filePath = path.join(uploadDir, fileName);
    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);

    req.on("end", () => {
      res.end("File uploaded successfully.");
    });

    req.on("error", (err) => {
      console.error("Error during file upload:", err);
      res.statusCode = 500;
      res.end("Error during file upload.");
    });
  }
});

httpServer.listen(8080);
