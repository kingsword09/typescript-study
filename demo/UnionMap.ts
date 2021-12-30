type KeyValue = {
    key: any;
    value: any;
}

interface IMap<T extends KeyValue> {
    clear(): void;
    has(key: T["key"]): boolean;
    delete(key: T["key"]): boolean;
    get(key: T["key"]): T["value"] | undefined;
    set(key: T["key"], value: T["value"]): boolean;
    forEach(callbackfn: (value: T["value"], key: T["key"], map: IMap<T>) => void, thisArg?: any): void;
    readonly size: number;
}

/**
 * 示例:
 * let map = new UnionMap<{key:{a:1};value:string;} | {key:"a1";value:number;}>();
 */
export default class UnionMap<T extends KeyValue> implements IMap<T> {
    private table: { [name: string | number | symbol]: KeyValue }

    constructor() {
        this.table = {};
    }

    private _convertKey<K extends T["key"]>(key: K): string | symbol {
        if(typeof key != "symbol") {
            return String(key);
        } else {
            return key;
        }
    }

    clear(): void {
        this.table = {};
    }

    has<K extends T["key"]>(key: K): boolean {
        let _key = this._convertKey(key);

        return !!this.table[_key];
    }

    delete<K extends T["key"]>(key: K): boolean {
        if(!this.has(key)) {
            return false;
        }

        let _key = this._convertKey(key);

        delete this.table[_key];
        
        return true;
    }

    get<K extends T["key"], V extends Extract<T, {key: K}>["value"]>(key: K): V | undefined {
        let _key = this._convertKey(key);

        return this.table[_key]?.value;
    }

    set<K extends T["key"], V extends Extract<T, {key: K}>["value"]>(key: K, value: V): boolean {
        let _key = this._convertKey(key);

        this.table[_key] = { key, value };

        return true;
    }

    forEach<K extends T["key"], V extends Extract<T, {key: K}>["value"]>(callbackfn: (value: V, key: K, map: IMap<T>) => void, thisArg?: any): void {
        let keys = Reflect.ownKeys(this.table);

        for(let i = 0; i < keys.length; i++) {
            let keyvalue = this.table[keys[i]];

            callbackfn(keyvalue.value, keyvalue.key, new UnionMap<T>());
        }

        return;
    }

    get size(): number {
        let keys = Reflect.ownKeys(this.table);

        return keys.length;
    }
}



// let map = new UnionMap<{key:{a:2};value:string;} | {key:"a2";value:number;}>();

// map.set("a2", 1);
// map.set({a:2}, "2");

// console.log(map.size);
// map.forEach((v, k) => {
//     if(typeof k == "object") {
//         console.log(`${JSON.stringify(k)} => ${v}`);
//     } else {
//         console.log(`${k} => ${v}`);
//     }
// });

// console.log(map.has({a:2}));
// console.log(map.get({a:2}));
// console.log(map.delete({a:2}));
// console.log(map);
// console.log(map.clear());
// console.log(map);




