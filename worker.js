export default {
  async fetch(request) {
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      server.accept();
      
      server.addEventListener("message", event => {
        // Просто пересылаем сообщение всем подключенным (простая комната)
        server.send(event.data); 
      });
      return new Response(null, { status: 101, webSocket: client });
    }
    return new Response("Сигнальный сервер работает", { status: 200 });
  }
};
