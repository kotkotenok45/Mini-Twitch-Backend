export class SignalingRoom {
  constructor(state) { this.state = state; this.sessions = new Set(); }

  async fetch(request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    server.accept();

    this.sessions.add(server);
    server.addEventListener('message', event => {
      // Рассылаем сигнал всем участникам комнаты (стримеру и зрителям)
      for (let session of this.sessions) {
        if (session !== server) session.send(event.data);
      }
    });

    server.addEventListener('close', () => this.sessions.delete(server));
    return new Response(null, { status: 101, webSocket: client });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const roomId = url.pathname.slice(1) || "default";
    const id = env.ROOM.idFromName(roomId);
    return env.ROOM.get(id).fetch(request);
  }
};
