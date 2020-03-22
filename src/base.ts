const noop = () => null

// type Deserializer = (key:string, data:any) => any
export interface Deserializer {
  (key:string, data:any): any
  serialize(key:string, data:any): any
}
export interface Dictionary<T> {
  [key: string]: T;
}
export enum publicClassMethods  {
  '$isInterface' = '$isInterface',
  '$diff' = '$diff',
  '$json' = '$json'
}
export abstract class Interface {
  
  protected _updatedCB: Function
  protected _originalData: Dictionary<any>
  protected _updatedData: Dictionary<any>
  protected _proxy: any

  constructor (data:Dictionary<any>={}, updatedCB:Function = noop) {
    this._updatedCB = updatedCB
    this._updatedData = {}
    this._originalData = {}
  }
  public $isInterface(): boolean {
    return true
  }
  public abstract $json():any 
  public abstract $diff():any
}
export type InterfaceClass = typeof Interface
export interface InterfaceLike extends InterfaceClass {
  constructor (data:Dictionary<any>, updatedCB:Function):InterfaceLike
}




  
