import { Pipe, PipeTransform } from '@angular/core';
import { Status } from './transaction.interfaces';

@Pipe({name: 'tranStatusDescription'})
export class StatusDescription implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.New) return 'Nueva';
        if (value === Status.InProcess) return 'En Proceso';
        if (value === Status.Finished) return 'Finalizada';
        if (value === Status.Error) return 'Error';
        if (value === Status.Cancel) return 'Cancelada';
        if (value === Status.CancelPayment ) return 'Cancelada Pagada';
        if (value === Status.CancelCashierError) return 'Cancelada Error Caja';
        if (value === Status.FinishTITOError) return 'Finalizada Error Impresión';
        return 'Unknown';
    }
}

@Pipe({name: 'tranPaymentMethodDescription'})
export class PaymentMethodDescription implements PipeTransform {
    transform(value: string | undefined): string {        
        if (value ==='account_money') return 'Dinero en Cuenta';
        if (value === 'credit_card') return 'Tarjeta de Crédito';
        return value??'-';
    }

  
}





@Pipe({name: 'tranStatusClass_border'})
export class StatusClassBorder implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.New) return 'border-light alert-light';
        if (value === Status.InProcess) return 'border-warning alert-warning';
        if (value === Status.Finished) return 'border-success alert-success';
        if (value === Status.Error) return 'border-danger alert-danger';
        if (value === Status.Cancel) return 'border-danger alert-danger';
        if (value === Status.CancelPayment ) return 'border-danger alert-danger';
        if (value === Status.CancelCashierError) return 'border-danger alert-danger';
        if (value === Status.FinishTITOError) return 'border-success alert-success';
        return 'border-dark';
    }
}

@Pipe({name: 'tranStatusClass_text'})
export class StatusClassText implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.New) return 'text-light';
        if (value === Status.InProcess) return 'text-warning';
        if (value === Status.Finished) return 'text-success';
        if (value === Status.Error) return 'text-danger';
        if (value === Status.Cancel) return 'text-danger';
        if (value === Status.CancelPayment ) return 'text-danger';
        if (value === Status.CancelCashierError) return 'text-danger';
        if (value === Status.FinishTITOError) return 'text-success';
        return 'text-dark';
    }
}

@Pipe({name: 'tranStatusClass_bg'})
export class StatusClassBg implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.New) return 'bg-light';
        if (value === Status.InProcess) return 'bg-warning';
        if (value === Status.Finished) return 'bg-success';
        if (value === Status.Error) return 'bg-danger';
        if (value === Status.Cancel) return 'bg-danger';
        if (value === Status.CancelPayment ) return 'bg-danger';
        if (value === Status.CancelCashierError) return 'bg-danger';
        if (value === Status.FinishTITOError) return 'bg-success';
        return 'bg-dark';
    }
}

@Pipe({name: 'tranStatusClass_text_bg'})
export class StatusClassTextBg implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.New) return 'text-bg-light';
        if (value === Status.InProcess) return 'text-bg-warning';
        if (value === Status.Finished) return 'text-bg-success';
        if (value === Status.Error) return 'text-bg-danger';
        if (value === Status.Cancel) return 'text-bg-danger';
        if (value === Status.CancelPayment ) return 'text-bg-danger';
        if (value === Status.CancelCashierError) return 'text-bg-danger';
        if (value === Status.FinishTITOError) return 'text-bg-success';

        return 'text-bg-dark';
    }
}

@Pipe({name: 'tranStatusClass_btn'})
export class StatusClassBtn implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.New) return 'btn-light';
        if (value === Status.InProcess) return 'btn-warning';
        if (value === Status.Finished) return 'btn-success';
        if (value === Status.Error) return 'btn-danger';
        if (value === Status.Cancel) return 'btn-danger';
        if (value === Status.CancelPayment) return 'btn-danger';
        if (value === Status.CancelCashierError) return 'btn-danger';
        if (value === Status.FinishTITOError) return 'btn-success';
      
        return 'btn-dark';
    }
}