import {UUID} from './types'

export interface MessageContext {
  correlationId: UUID
}

export interface Message {
  id?: UUID
  timestamp?: string
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
  context?: MessageContext
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Event extends Message {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Command extends Message {
}

export type Listener = (event: Message) => void

export interface Eventbus {
  dispatch(ev: Message): void

  subscribe(type: string, listener: Listener): void

  subscribeOnce(type: string, listener: Listener): void

  unsubscribe(type: string, listener: Listener): void

  release(): void
}

export class SimpleEventbus implements Eventbus {
  private _listeners: Record<string, Listener[]>
  private _onceListeners: Record<string, Listener[]>

  public constructor() {
    this._listeners = {}
    this._onceListeners = {}
  }

  public dispatch(ev: Message): void {
    this._dispatch(ev.type, ev)
    this._dispatch('*', ev)
  }

  private _dispatch(type: string, ev: Message): void {
    this._ensure(type)
    this._listeners[type].forEach(listener => listener(ev))
    this._onceListeners[type].forEach(listener => listener(ev))
    this._onceListeners[type] = [] // dispatched, now clear!
  }

  public subscribe(type: string, listener: Listener): void {
    this._ensure(type)
    this._listeners[type].push(listener)
  }

  public subscribeOnce(type: string, listener: Listener): void {
    this._ensure(type)
    this._onceListeners[type].push(listener)
  }

  private _ensure(type: string): void {
    if (!this._listeners.hasOwnProperty(type) || !this._listeners[type]) {
      this._listeners[type] = []
    }
    if (!this._onceListeners.hasOwnProperty(type) || !this._onceListeners[type]) {
      this._onceListeners[type] = []
    }
  }

  public unsubscribe(type: string, listener: Listener): void {
    this._ensure(type)
    const index = this._listeners[type].indexOf(listener)
    this._listeners[type].splice(index, 1)
  }

  public release(): void {
    this._listeners = {}
    this._onceListeners = {}
  }
}
