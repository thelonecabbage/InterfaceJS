export interface Deserializer {
    (key: string, data: any): any;
    serialize(key: string, data: any): any;
}
export interface Dictionary<T> {
    [key: string]: T;
}
export declare enum publicClassMethods {
    '$isInterface' = "$isInterface",
    '$diff' = "$diff",
    '$json' = "$json"
}
export declare abstract class Interface {
    protected _updatedCB: Function;
    protected _originalData: Dictionary<any>;
    protected _updatedData: Dictionary<any>;
    protected _proxy: any;
    constructor(data?: Dictionary<any>, updatedCB?: Function);
    $isInterface(): boolean;
    abstract $json(): any;
    abstract $diff(): any;
}
export declare type InterfaceClass = typeof Interface;
export interface InterfaceLike extends InterfaceClass {
    constructor(data: Dictionary<any>, updatedCB: Function): InterfaceLike;
}
