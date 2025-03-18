import { PaginationDTO } from "../../../../sielcon-pay-backend/src/common/dtos/pagination.data";

export interface Transaction {
    transactionId: number;    
    description: string
    stamp: Date;
    status: Status;
    terminalId: number,
    terminal: Terminal
    amount: number,
    taxPercentage : number,
    tax: number,
    total: number,
    orderRequestData:string
    orderResponseData:string
    merchantOrderData :string
    paymentData:string    
    paymentId : string
    paymentUser:string
    paymentMethod : string
    feeBorneClientCharge:boolean
    mpFee:number
    mpTax:number
    mptotal:number
}

export interface Terminal {
    terminalId: string
    name: string;
}


export interface TransactionLog {
    description: string
    stamp: Date,
    data: string,
    info: string
}


export enum Status {
    New = 0,
    InProcess = 1,
    Finished = 2,
    Error = 3,
    Cancel = 4,
    CancelPayment = 5,
    CancelCashierError = 6,
    FinishTITOError = 7    
}

export interface Filter
{
    terminalList: Terminal[]
    statusList : Status[]
    from : string
    to: string    
    limit?: number;    
    offset?: number;
}