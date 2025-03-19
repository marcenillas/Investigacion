import { Pipe, PipeTransform } from '@angular/core';
import { OperatorAction } from './operatorLog.interfaces';

@Pipe({name: 'operatorActionDescription'})
export class OperatorActionDescription implements PipeTransform {
    transform(value: OperatorAction | undefined): string {        
        if (value === OperatorAction.Entry) return 'Ingreso';
        if (value === OperatorAction.PrintTestTicket) return 'Impresión Ticket';
        if (value === OperatorAction.PrintVoucherTicket ) return 'Impresión Cupón';
        if (value === OperatorAction.RePrintTransactionVoucher) return 'Re Impresión  Cupón';
        if (value === OperatorAction.Exit ) return 'Salir';
        if (value === OperatorAction.Transactions) return 'Transacciones';
        if (value === OperatorAction.RePrintTransactionTicket) return 'Re Impresión  Ticket';
        if (value === OperatorAction.Configuration) return 'Configuración';
        if (value === OperatorAction.UpdateConfiguration) return 'Actualizar Configuración';
        return 'Unknown';
    }
}

@Pipe({name: 'operatorActionClass_border'})
export class  OperatorActionClassBorder implements PipeTransform {
    transform(value: OperatorAction | undefined): string {                
        return 'border-light alert-light';
    }
}

@Pipe({name: 'operatorActionClass_text'})
export class  OperatorActionClassText implements PipeTransform {
    transform(value: OperatorAction | undefined): string {                
        return 'text-light';
    }
}

@Pipe({name: 'operatorActionClass_bg'})
export class  OperatorActionClassBg implements PipeTransform {
    transform(value: OperatorAction | undefined): string {        
        return 'bg-light';
    }
}

@Pipe({name: 'operatorActionClass_text_bg'})
export class  OperatorActionClassTextBg implements PipeTransform {
    transform(value: OperatorAction | undefined): string {                
        return 'text-bg-light';
    }
}

@Pipe({name: 'operatorActionClass_btn'})
export class  OperatorActionClassBtn implements PipeTransform {
    transform(value: OperatorAction | undefined): string {                
        return 'btn-light';
    }
}
