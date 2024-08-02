import { ISendUpdate } from "../interfaces";

export function SendUpdate(params: ISendUpdate) {
  if (params.socket.readyState === WebSocket.OPEN) {
    console.log("Sending data");
    params.socket.send(
      params.socket.url.includes("coins")
        ? JSON.stringify({ coins: params.value.toFixed(0).toString() })
        : JSON.stringify({ energy: params.value.toFixed(0).toString() })
    );
  } else {
    console.error("WebSocket is not open");
    params.messageQueue.push(params.value);
  }
}
