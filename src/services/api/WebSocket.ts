import { SendUpdate } from "./SendUpdate";

export const SocketListener = (socket: WebSocket, messageQueue: number[]) => {
  socket.onopen = () => {
    console.log(`Socket is open now.`);
    while (messageQueue.length > 0) {
      const firstElem = messageQueue.shift();
      firstElem &&
        SendUpdate({
          socket: socket,
          value: firstElem,
          messageQueue: messageQueue,
        });
    }
  };

  socket.onclose = () => {
    console.log("Socket is closed now.");
  };

  socket.onerror = (e) => console.log("Socket error: ", e);
};
