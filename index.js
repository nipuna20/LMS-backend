const http = require("http");
const debug = require("debug")("node-angular");
const app = require("./app");

// Normalize port into a number, string, or false
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val; // Named pipe
  if (port >= 0) return port; // Port number
  return false;
};

// Event listener for HTTP server "error" event
const onError = (error, port) => {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? `pipe ${port}` : `port ${port}`;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Event listener for HTTP server "listening" event
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
  console.log(`Server is running and listening on ${bind}`);
};

// Normalize port and set it on the app
const port = normalizePort(process.env.PORT || "9000");
app.set("port", port);

// Create HTTP server
const server = http.createServer(app);

// Attach error and listening handlers
server.on("error", (error) => onError(error, port));
server.on("listening", onListening);

// Start the server
server.listen(port, () => {
  console.log(`Server started successfully on port ${port}`);
});
