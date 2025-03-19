import { User } from "../user/user.interfaces";

export interface OperatorLog {
    operatorLogId: string;
    operatorEmail: string;
    terminalId : string,
    terminal: Terminal
    operatorAction : OperatorAction
    description: string
    data: string;
    info: string
    stamp: Date;        
}


export interface Terminal {
    terminalId: string
    name: string;
}


export enum OperatorAction {
    Entry= 1,
    PrintTestTicket = 2,
    PrintVoucherTicket = 3,
    Transactions=6,
    RePrintTransactionVoucher = 4,      
    RePrintTransactionTicket=7,
    Configuration = 8,
    UpdateConfiguration = 9,
    Exit = 5,
}

export interface Filter
{
    from : string
    to: string    
    operatorList: User[];
    terminalList: Terminal[];
    operatorActionList : OperatorAction[] ;
    limit?: number;    
    offset?: number;
}