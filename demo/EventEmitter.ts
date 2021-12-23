type EventNameType = string | symbol;

interface Listener {
    (...args: any[]): void;
    fn?: Listener;
}

interface Events {
    [eventname: EventNameType]: Listener[]
}

interface IEventEmitter<T> {
    on(eventname: T, callback: Listener): IEventEmitter<T>;
    addListener(eventname: T, callback: Listener): IEventEmitter<T>;
    once(eventname: T, callback: Listener): IEventEmitter<T>;
    off(eventname: T, callback: Listener): IEventEmitter<T>;
    removeListener(eventname: T, callback: Listener): IEventEmitter<T>;
    removeAllListeners(eventname?: T): IEventEmitter<T>;
    emit(eventname: T, callback: Listener): boolean;
    readonly eventNames: EventNameType[];
}

export default class EventEmitter<T> implements IEventEmitter<T> {
    protected events: Events = {};

    private _preprocess(eventname: T): EventNameType {
        if(typeof eventname != "symbol") {
            return String(eventname);
        } else {
            return eventname;
        }
    }

    on(eventname: T, callback: Listener): EventEmitter<T> {
        let _eventName = this._preprocess(eventname);
        this.events[_eventName]?.push(callback) || (this.events[_eventName] = [callback]);
        return this;
    }

    addListener(eventname: T, callback: Listener): EventEmitter<T> {
        return this.on(eventname, callback);
    }

    once(eventname: T, callback: Listener): EventEmitter<T> {
        let _once: Listener = (...args) => {
            // console.log("_once");
            callback(...args);

            this.off(eventname, _once);
        };
        // console.log("once");

        _once.fn = callback;

        this.on(eventname, _once);

        return this;
    }

    emit(eventname: T, ...args: any[]): boolean {
        let _eventName = this._preprocess(eventname);

        if(!this.events[_eventName]) {
            return false;
        }

        this.events[_eventName].forEach((listener) => {
            return listener(...args);
        });

        return true;
    }

    off(eventname: T, callback: Listener): EventEmitter<T> {
        // console.log("off");
        let _eventName = this._preprocess(eventname);
        const listeners = this.events[_eventName];
        // console.log(listeners);

        if(Array.isArray(listeners) && listeners.length > 0) {
            for(let i = 0; i < listeners.length; i++) {
                // console.log(listeners[i] === callback || listeners[i] === callback.fn);
                if(listeners[i] === callback || listeners[i] === callback.fn) {
                    listeners.splice(i, 1);
                }
            }
        }

        return this;
    }

    removeListener(eventname: T, callback: Listener): EventEmitter<T> {
        return this.off(eventname, callback);
    }

    removeAllListeners(eventname?: T): EventEmitter<T> {
        if(eventname) {
            let _eventName = this._preprocess(eventname);
            this.events[_eventName] = [];
        } else {
            let _eventNames = this.eventNames;

            for(let i = 0; i < _eventNames.length; i++) {
                this.events[_eventNames[i]] = [];
            }
        }

        return this;
    }

    get eventNames(): EventNameType[] {
        // return Object.keys(this.events);
        // return Object.getOwnPropertyNames(this.events);
        // return Object.getOwnPropertySymbols(this.events);
        return Reflect.ownKeys(this.events);
    }
}
