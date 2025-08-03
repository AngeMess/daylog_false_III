// @daylog/cache
import { createClient } from 'redis';

class Cache {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.connected = false;
    this.initialize();
  }

  async initialize() {
    try {
      await this.client.connect();
      this.connected = true;
      console.log('Cliente Redis conectado');
    } catch (error) {
      console.error('Error de conexión Redis:', error);
      this.connected = false;
    }
  }

  async get(key) {
    if (!this.connected) return null;
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error al obtener de caché:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    if (!this.connected) return false;
    try {
      await this.client.set(key, JSON.stringify(value), { EX: ttl });
      return true;
    } catch (error) {
      console.error('Error al establecer en caché:', error);
      return false;
    }
  }

  async invalidate(prefix) {
    if (!this.connected) return false;
    try {
      const keys = await this.client.keys(`${prefix}:*`);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Error al invalidar caché:', error);
      return false;
    }
  }
}

export default new Cache();
