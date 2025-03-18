export enum TransactionStatus {
    New = 0,
    InProcess = 1,
    Finished = 2,
    Error = 3,
    Cancel = 4,
    CancelPayment = 5,
    CancelCashierError = 6,
    FinishTITOError = 7
}

export enum TransactionStep {
    New = 0,
    SendToCashier = 1,
    ReceiveFromCashier = 2,
    SendToMP = 3,
    ReceiveFromMP = 4,
    ReceivePayment = 5,
    CancelPayment = 6,
    PrintTITO = 7,
    PrintTicket = 8,
    OrderErrorFromMP = 9,
    ReceiveMerchantOrder = 10,
    ReceiveMPError = 11,
    PrintTITOError = 12,
	ReceiveCashierError = 13,    
    RePrintTITO = 14,    
    RePrintTicket=15,
}