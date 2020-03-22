import { Interface, InterfaceLike, InterfaceClass, Dictionary, Deserializer } from './base';
export declare abstract class iClass extends Interface {
    protected _definition: Dictionary<Deserializer | Interface | InterfaceClass | InterfaceLike>;
    protected _initData: Dictionary<any>;
    constructor(data: Dictionary<any>, updatedCB?: Function);
    private keyUpdated;
    protected getHandlers(key: string): {
        handler: Deserializer;
        Handler: InterfaceLike;
        isInstance: boolean;
    };
    protected deserialize(key: string, data: any): any;
    protected serialize(key: string, data: any): any;
    get(target: iClass, key: string | number): Dictionary<any>;
    set(target: iClass, key: string, value: any): boolean;
    $diff(): Dictionary<any>;
    $json(): Dictionary<any>;
}
