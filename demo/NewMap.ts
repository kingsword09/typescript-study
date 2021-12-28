interface IMap<T> {
    clear(): void;
    delete(key: keyof T): boolean;
    forEach(callbackfn: (value: T[keyof T], key: keyof T, map: IMap<T>) => void, thisArg?: any): void;
    get(key: keyof T): T[keyof T] | undefined;
    has(key: keyof T): boolean;
    set(key: keyof T, value: T[keyof T]): boolean;
    readonly size: number;
}

interface KeyValue<K, V> {
    key: K;
    value: V;
}

/** 
 * 示例:
 * let map = new NewMap<{"a1":number;"a2":string}>();
 * map.set("a1", 1); 
 */
export default class NewMap<T> implements IMap<T> {
    // private table: { [key: string | number | symbol]: any };
    // private table: { [key: string | number | symbol]: T[keyof T] };
    // private table: { [name: string | number | symbol]: { key: keyof T; value: T[keyof T] } };
    private table: { [name: string | number | symbol]: KeyValue<keyof T, T[keyof T]> };

    constructor() {
        this.table = {};
    }

    private _preprocess(key: keyof T) {
        if(typeof key != "symbol") {
            return String(key);
        } else {
            return key;
        }
    }

    clear(): void {
        this.table = {};
    }

    has<K extends keyof T>(key: K): boolean {
        let _key = this._preprocess(key);

        return !!this.table[_key];
    }

    delete<K extends keyof T>(key: K): boolean {
        if(!this.has(key)) {
            return false;
        }

        let _key = this._preprocess(key);

        delete this.table[_key];

        return true;
    }

    get(key: keyof T): T[keyof T] | undefined {
        let _key = this._preprocess(key);

        return this.table[_key]?.value;
    }

    set<K extends keyof T>(key: K, value: T[K]): boolean {
        let _key = this._preprocess(key);
        
        this.table[_key] = { key:key, value:value };

        return true;
    }

    forEach(callbackfn: (value: T[keyof T], key: keyof T, map: NewMap<T>) => void, thisArg?: any): void {
        let keys = Reflect.ownKeys(this.table);
        // console.log(keys);

        for(let i = 0; i < keys.length; i++) {
            // console.log(keys[i]);
            callbackfn(this.table[keys[i]].value, this.table[keys[i]].key, new NewMap<T>());
        }

        return;
    }

    get size(): number {
        let keys = Reflect.ownKeys(this.table);

        return keys.length;
    }
}

// let map = new NewMap<{"a1": string; "a2": number; "1": number;}>();
// // map.delete("a1");
// map.set("a1", "1");
// map.set("a2", 2);
// console.log(map);
// console.log(map.get("a1"));
// map.forEach((v, i) => {
//     console.log(v);
//     console.log(i);
// });
// console.log(map.size);































