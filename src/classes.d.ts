export interface Deserializer {
    (key: string, data: any): any;
    serialize(key: string, data: any): any;
}
export interface Dictionary<T> {
    [key: string]: T;
}
export declare class Interface {
    definition(): Dictionary<Deserializer | Interface>;
    protected originalData: Dictionary<any>;
    protected updatedData: Dictionary<any>;
    protected updatedCB: Function;
    protected _definition: Dictionary<Deserializer | Interface>;
    protected _proxy: any;
    constructor(data?: Dictionary<any>, updatedCB?: Function);
    private keyUpdated;
    private getHandlers;
    private deserialize;
    private serialize;
    private parseObj;
    private proxyHandler;
    private diff;
    private serializeObj;
}
