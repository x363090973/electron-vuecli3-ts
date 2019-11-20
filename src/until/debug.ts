


class Debug {
    private prefix: string = ''
    private colorOffset: number = Math.random()
    private colorStep: number = 0
    
  
    constructor(prefix: string) {
      this.prefix = `[${prefix}] ` //名称标识
    }
  
    public colorCode(): string {
      const h = (this.colorOffset + ++this.colorStep) * 137
      const s = (0.65 + 0.2 * Math.random()) * 100
      const l = (0.7 + 0.2 * Math.random()) * 100
  
      return `hsl(${h}, ${s}%, ${l}%)`
    }
  
    public error(msg: string, ...payload: any[]) {
      console.error(this.prefix + msg, ...payload)
    }
  
    public warn(msg: string, ...payload: any[]) {
        console.warn(this.prefix + msg, ...payload)
    }
  
    public log(msg: string, ...payload: any[]) {
        console.log(this.prefix + msg, ...payload)
    }
  

  }
  
  export default Debug
  