import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { OrderRequiredDTO, OrderResponseDTO } from '../dtos/order.data';
import { UtilService } from './util.service';
import { MPDTO } from '../dtos/mp.data';
import QRCode from 'qrcode';
import * as mqtt from 'mqtt'


@Injectable()
export class MPService {

    private mqttClient: mqtt.MqttClient;
    private readonly logger = new Logger('MPService');

    constructor(private readonly utilService: UtilService) {
        this.mqttClient = mqtt.connect('mqtt://localhost:1883');
    }

   private generateMPOrderData(data: OrderRequiredDTO): AxiosRequestConfig {

        const nowformat = new Date().toISOString()
            .replace(/[^0-9]/g, "")
            .slice(0, -5);

        const options: AxiosRequestConfig = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: `https://api.mercadopago.com/instore/orders/qr/seller/collectors/${data.mpdata.userid}/pos/${data.mpdata.posid}/qrs`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.mpdata.authorizationtoken}`
            },
            data: JSON.stringify({
                external_reference: data.code,
                total_amount: data.totalAmount,
                expiration_date: this.utilService.addSecondsToCurrentDate(parseInt(data.mpdata.expirateTransaction)),
                title: data.title,
                description: data.description,
                items: [
                    {
                        title: "Ticket",
                        description: "Ticket",
                        quantity: 1,
                        unit_measure: 'unit',
                        unit_price: data.totalAmount,
                        total_amount: data.totalAmount
                    }
                ],
                notification_url: `${process.env.HOST_URL}mp/notification`
            })
        };
        return options;
    }

   private getCajasMP(data: MPDTO): AxiosRequestConfig {
        const options = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `https://api.mercadopago.com/pos`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.authorizationtoken}`
            },
        };
        return options;

    }


    async generateOrder(data: OrderRequiredDTO): Promise<OrderResponseDTO> {
        const options: AxiosRequestConfig = this.generateMPOrderData(data);

        try {
            const response = await this.utilService.sendData(options);

            if (response.hasOwnProperty('error')) {
                return {
                    error: response.error,
                    message: response.message,
                };
            }            
            return {
                orderId: response.in_store_order_id,
                qrData: response.qr_data,
            };
        } catch (error) {
            return {
                error: 'Error en la generación de la orden',
                message: error.message,
            };
        }
    }

    async status(data: MPDTO): Promise<boolean> {
        const options: AxiosRequestConfig = this.getCajasMP(data);

        try {
            const response = await this.utilService.sendData(options);

            if (response.hasOwnProperty('error')) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    async handleNotification(data: any): Promise<void> {
        try {
          this.logger.debug("Enviado notificación MQTT:",data);
          this.mqttClient.publish('mercadoPago/notifications', JSON.stringify(data));
        } catch (error) {
            this.logger.error('Error enviando notificación MQTT:', error);
        }
      }

}


