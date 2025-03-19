export enum TransactionStatus {
    New = 0,
    InProcess = 1,
    Finished = 2,
    Error = 3,
    Cancel = 4,
    CancelPayment = 5,
    CancelCashError = 6,
    FinishVoucherError = 7
}

export enum TransactionStep {
    New = 0,
    SendToCash = 1,
    ReceiveFromCash = 2,
    SendToMP = 3,
    ReceiveFromMP = 4,
    ReceivePayment = 5,
    CancelPayment = 6,
    PrintVoucher = 7,
    PrintTicket = 8,
    OrderErrorFromMP = 9,
    ReceiveMerchantOrder = 10,
    ReceiveMPError = 11,
    PrintVoucherError = 12,
	ReceiveCashError = 13,    
    RePrintVoucher= 14,    
    RePrintTicket=15,
}