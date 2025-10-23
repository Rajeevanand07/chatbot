const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/services/ai.service");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

// const chatHistory = [
//   {
//     role: "user",
//     parts: [{ text: "what is the color of rose?" }],
//   },
//   {
//     role: "model",
//     parts: [{ tex: "the color of rose is red." }],
//   },
// ];

const chatHistory = []; // array for short term memory

io.on("connection", (socket) => {
  console.log("connection created");

  socket.on("ai-message", async (data) => {
    chatHistory.push({
      role: "user",
      parts: [{ text: data.message }],
    });

    const message = await generateResponse(chatHistory);

    chatHistory.push({
      role: "model",
      parts: [{ text: message }],
    });

    socket.emit("ai-response-message", { message });
  });

  socket.on("disconnect", () => {
    console.log("connection disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("server running on port 3000");
});
