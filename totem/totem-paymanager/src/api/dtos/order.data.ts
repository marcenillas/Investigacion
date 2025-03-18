import { MPDTO } from "./mp.data";

export class OrderRequiredDTO {
    code: string;
    totalAmount: number;
    title: string;
    description: string;
    mpdata: MPDTO;
  }

  export class OrderResponseDTO {    
    orderId?: string;
    qrData?: string; // Opcional para caso de éxito  
    error?: string;      
    message?: string;
  }
  