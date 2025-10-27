// Apollo Server
const { startServer } = require("./api/server");

// File System : Read and Write
const fs = require("fs");

// HTTPS server
const https = require("https");

async function main() {
  // Start Express + Apollo
  const app = await startServer();

  // Certification and Keys
  const sslOptions = {
    key: fs.readFileSync(__dirname + process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(__dirname + process.env.SSL_CERT_PATH),
  };

  // Create HTTPS server
  https.createServer(sslOptions, app).listen(process.env.PORT || 3443, () => {
    console.log(
      `HTTPS server running at https://localhost:${
        process.env.PORT || 3443
      }/graphql`
    );
  });
}

main().catch((err) => {
  console.error("Server failed to start", err);
  process.exit(1);
});
