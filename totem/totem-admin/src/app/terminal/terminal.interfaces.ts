export interface Terminal {
    terminalId: string;
    name: string;
    description: string;
    enabled: boolean;
    modeQR: boolean;
	modeFixed: boolean;
    status: Status;
    printVoucher: boolean;
    printerVoucherCom: string;
    printTicket: boolean;
    printerTicketName: string;
    storeId: string;
    posId: string;
    definedValues: string;
    carrouselImage01: string;
    carrouselImage02: string;
    carrouselImage03: string;
    carrouselImage04: string;
    carrouselImage05: string;
    lastTransaction?: Date;
    lastEvent?: Date;
    lastConnection?: Date;
    carrouselImageData01S? : string;
    carrouselImageData02S? : string;
    carrouselImageData03S? : string;
    carrouselImageData04S? : string;
    carrouselImageData05S? : string
    code?: string;
    useCash: boolean;
}

export enum Status {
    Initializing = 0,
    Online = 1,
    Offline = 2,
    Warning = 3,
}