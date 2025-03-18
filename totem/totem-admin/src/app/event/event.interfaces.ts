export interface Event {
    eventId: number;
    name: string;
    description: string
    stamp: Date;
    type: Type;
    terminalId: number,
    terminal: Terminal
    origin: string
    state: string
}


export interface Terminal {
    terminalId: string
    name: string;
}


export enum Type {
    Info = 0,
    Warning = 1,
    Error = 2,
}

export interface Filter
{
    terminalList: Terminal[]
    typeList : Type[]
    from : string
    to: string    
    limit?: number;    
    offset?: number;
}