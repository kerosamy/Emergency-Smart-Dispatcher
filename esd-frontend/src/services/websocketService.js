import { Client } from '@stomp/stompjs';

export class EnhancedWebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000;
    this.statusCallback = null;
    this.messageCallback = null;
  }

  connect(token, onStatusChange, onMessage) {
    if (this.client && this.client.connected) {
      console.log('WS already connected');
      return;
    }

    this.statusCallback = onStatusChange;
    this.messageCallback = onMessage;
    this.statusCallback && this.statusCallback('connecting');

    const WS_URL = 'http://localhost:8080/ws';

    this.client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
        if (str.includes('ERROR')) console.error('STOMP:', str);
      },
      onConnect: () => {
        console.log('✅ WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.statusCallback && this.statusCallback('connected');
      },
      onDisconnect: () => {
        console.log('❌ WebSocket disconnected');
        this.statusCallback && this.statusCallback('disconnected');
        this.subscriptions.clear();
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers['message']);
        this.statusCallback && this.statusCallback('error');
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          this.statusCallback && this.statusCallback('reconnecting');
        }
      },
      onWebSocketError: (event) => {
        console.error('❌ WebSocket error:', event);
        this.statusCallback && this.statusCallback('error');
      }
    });

    this.client.activate();
  }

  subscribe(destination, callback) {
    if (!this.client || !this.client.connected) {
      console.warn('⚠️ Cannot subscribe: WS not connected');
      return;
    }

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
      body: JSON.stringify(body)
    });
  }

  disconnect() {
    console.log('Disconnecting WebSocket...');
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
    this.client && this.client.deactivate();
    this.client = null;
    this.statusCallback && this.statusCallback('disconnected');
  }

  isConnected() {
    return this.client ? this.client.connected : false;
  }
}

export const wsService = new EnhancedWebSocketService();
