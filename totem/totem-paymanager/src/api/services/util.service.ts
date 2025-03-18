import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class UtilService {
  

  async sendData(options: AxiosRequestConfig): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios(options);
        resolve(response.data);
      } catch (error) {
        try {
          if (error.response) {          
            reject(new Error(error.response.data.message));
          } else if (error.isAxiosError) {
            reject(new Error(error.cause));
          } else {
            reject(new Error(error));
          }
        } catch (error1) {
          reject(new Error(error1));
        }
      }
    });
  }

  truncate(num: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(num * factor) / factor;
  }

  addSecondsToCurrentDate(seconds: number): string {
    const currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + seconds);

    const offset = currentDate.getTimezoneOffset();
    const localDate = new Date(currentDate.getTime() - offset * 60000);
    const isoString = localDate.toISOString();

    const offsetHours = Math.abs(Math.floor(offset / 60));
    const offsetMinutes = Math.abs(offset % 60);
    const offsetSign = offset > 0 ? '-' : '+';
    const formattedOffset = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

    return isoString.replace('Z', formattedOffset);
  }
  
}
