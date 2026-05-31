// =============================================================
//  EventEmitter — système Pub/Sub minimal.
//  Base de Time, Sizes, Router et de toute logique événementielle.
// =============================================================

export default class EventEmitter {
  constructor() {
    // Map<nomEvenement, Set<callback>>
    this._listeners = new Map();
  }

  // Abonne `callback` à l'événement `name`. Retourne une fonction de désabonnement.
  on(name, callback) {
    if (!this._listeners.has(name)) {
      this._listeners.set(name, new Set());
    }
    this._listeners.get(name).add(callback);
    return () => this.off(name, callback);
  }

  // Désabonne. Sans `callback`, supprime tous les abonnés de `name`.
  off(name, callback) {
    const set = this._listeners.get(name);
    if (!set) return;
    if (callback) {
      set.delete(callback);
      if (set.size === 0) this._listeners.delete(name);
    } else {
      this._listeners.delete(name);
    }
  }

  // Émet l'événement `name` ; chaque abonné reçoit `payload`.
  emit(name, payload) {
    const set = this._listeners.get(name);
    if (!set) return;
    // Copie défensive : un callback peut se désabonner pendant l'itération.
    for (const callback of [...set]) {
      callback(payload);
    }
  }

  // Détruit tous les abonnements.
  destroy() {
    this._listeners.clear();
  }
}
