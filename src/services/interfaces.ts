export interface IPosition {
  x: number;
  y: number;
}

export interface ISendUpdate {
  socket: WebSocket;
  value: number;
  messageQueue: number[];
}
