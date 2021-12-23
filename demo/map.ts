interface IMap<K, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): boolean;
    readonly size: number;
}

class ValuePair<K, V> {
    key: K;
    value: V;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }

    toString() {
        return `{${this.key} => ${this.value}}`
    }
}

export default class NewMap<K, V> implements IMap<K, V> {
    private table: { [key: string]: ValuePair<K, V> }

    constructor() {
        this.table = {};
    }

    private _convertToString(key: K): string {
        return String(key);
    }

    private _keyValues(): ValuePair<K, V>[] {
        let keyValues = [];

        const _keys = Object.keys(this.table);

        for (let i = 0; i < _keys.length; i++) {
            keyValues.push(this.table[_keys[i]]);
        }

        return keyValues;
    }

    has(key: K): boolean {
        // if(!key) {
        //     return false;
        // }

        let _key = this._convertToString(key);

        return !!this.table[_key];
    }

    clear(): void {
        this.table = {};
    }

    delete(key: K): boolean {
        // if(!key || !this.has(key)) {
        //     return false;
        // }

        if(!this.has(key)) {
            return false;
        }

        let _key = this._convertToString(key);

        delete this.table[_key];

        return true;
    }

    get(key: K): V {
        // if(!key || !this.has(key)) {
        //     return ;
        // }

        let _key = this._convertToString(key);

        return this.table[_key]?.value;
    }
    
    set(key: K, value: V): boolean {
        let _key = this._convertToString(key);

        this.table[_key] = new ValuePair(key, value);

        return true;
    }

    get size(): number {
        return this._keyValues().length;
    }

    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        let keyValues = this._keyValues();

        for(let i = 0; i < keyValues.length; i++) {
            callbackfn(keyValues[i].value, keyValues[i].key, new Map());
        }

        return;
    }
}


















