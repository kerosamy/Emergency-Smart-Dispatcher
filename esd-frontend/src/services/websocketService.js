import { Client } from '@stomp/stompjs';

export class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.reconnectDelay = 5000;
    this.statusCallback = null;
    this.messageCallback = null;
    this.pendingSubscriptions = [];
  }

  connect(onStatusChange, onMessage) {
    if (this.client && this.client.connected) {
      console.log('WS already connected');
      return;
    }

    this.statusCallback = onStatusChange;
    this.messageCallback = onMessage;
    this.statusCallback && this.statusCallback('connecting');

    const WS_URL = 'ws://localhost:8080/ws'; // your backend endpoint

    this.client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
      debug: (str) => {
        if (str.includes('ERROR')) console.error('STOMP:', str);
      },
      onConnect: () => {
        console.log('✅ WebSocket connected successfully');
        this.statusCallback && this.statusCallback('connected');

        // Subscribe to any pending destinations
        this.pendingSubscriptions.forEach(({ destination, callback }) => {
          this._doSubscribe(destination, callback);
        });
        this.pendingSubscriptions = [];
      },
      onDisconnect: () => {
        console.log('❌ WebSocket disconnected');
        this.statusCallback && this.statusCallback('disconnected');
        this.subscriptions.clear();
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers['message']);
        this.statusCallback && this.statusCallback('error');
      },
      onWebSocketError: (event) => {
        console.error('❌ WebSocket error:', event);
        this.statusCallback && this.statusCallback('error');
      },
    });

    this.client.activate();
  }

  subscribe(destination, callback) {
    if (!this.client) {
      console.warn('⚠️ WS client not initialized');
      return;
    }

    if (!this.client.connected) {
      // Queue subscription until connected
      this.pendingSubscriptions.push({ destination, callback });
      return () => {
        this.pendingSubscriptions = this.pendingSubscriptions.filter(
          (sub) => sub.destination !== destination
        );
      };
    }

    return this._doSubscribe(destination, callback);
  }

  _doSubscribe(destination, callback) {
    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const payload = JSON.parse(message.body);
        this.messageCallback && this.messageCallback(payload);
        callback(payload);
      } catch (e) {
        console.error('❌ Failed to parse WS message:', e);
      }
    });

    this.subscriptions.set(destination, subscription);

    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    };
  }

  send(destination, body) {
    if (!this.client || !this.client.connected) {
      console.warn('⚠️ Cannot send: WS not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  disconnect() {
    console.log('Disconnecting WebSocket...');
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.client && this.client.deactivate();
    this.client = null;
    this.statusCallback && this.statusCallback('disconnected');
  }

  isConnected() {
    return this.client ? this.client.connected : false;
  }
}

// Singleton instance
export const wsService = new WebSocketService();
