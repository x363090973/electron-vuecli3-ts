export interface ApiCallingFn<P = any, D = any> {
    ( data?:any): Promise<D>
}

export interface User {
  name:string,
  id?:string
}
