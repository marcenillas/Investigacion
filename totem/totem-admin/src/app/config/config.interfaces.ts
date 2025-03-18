export interface Config {
    configurationId: string;
    mpAuthorizationToken?: string;
    mpUserId?: string;
    mpNotificationURL?: string;
    taxPercentage?: number;
    TITOTitle? : string;
    TITOLine1? : string;
    TITOLine2? : string;
    TITOLine3? : string;
    logoMPImage: string;
    logoSielconImage: string;
    logoSalaImage: string;
    logoMPImageDataS?: string;
    logoSielconImageDataS?: string;
    logoSalaImageDataS?: string;   
    currencySymbol?: string;     
    feeBorneClientCharge? : boolean
    salaName?: string;
    takeSalaNameConfiguration?: boolean;    
    printCancelTransaction?: boolean;
    mpExpirateTransaction?: number;
    salaAddress? : string
}