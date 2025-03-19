export interface Config {
    configurationId: string;
    mpAuthorizationToken?: string;
    mpUserId?: string;
    mpNotificationURL?: string;
    taxPercentage?: number;
    voucherTitle? : string;
    voucherLine1? : string;
    voucherLine2? : string;
    voucherLine3? : string;
    logoMPImage: string;
    logoCompanyImage: string;
    logoBranchImage: string;
    logoMPImageDataS?: string;
    logoCompanyImageDataS?: string;
    logoBranchImageDataS?: string;   
    currencySymbol?: string;     
    feeBorneClientCharge? : boolean
    branchName?: string;
    takeBranchNameConfiguration?: boolean;    
    printCancelTransaction?: boolean;
    mpExpirateTransaction?: number;
    branchAddress? : string
}