import { Pipe, PipeTransform } from '@angular/core';
import { Type } from './event.interfaces';

@Pipe({name: 'typeDescription'})
export class TypeDescription implements PipeTransform {
    transform(value: Type | undefined): string {        
        if (value === Type.Info) return 'Información';
        if (value === Type.Warning) return 'Advertencia';
        if (value === Type.Error) return 'Error';
        return 'Unknown';
    }
}

@Pipe({name: 'typeClass_border'})
export class TypeClassBorder implements PipeTransform {
    transform(value: Type | undefined): string {        
        if (value === Type.Info) return 'border-light alert-light';
        if (value === Type.Warning) return 'border-warning alert-warning';
        if (value === Type.Error) return 'border-danger alert-danger';
        return 'border-dark';
    }
}

@Pipe({name: 'typeClass_text'})
export class TypeClassText implements PipeTransform {
    transform(value: Type | undefined): string {        
        if (value === Type.Info) return 'text-light';
        if (value === Type.Warning) return 'text-warning';
        if (value === Type.Error) return 'text-danger';
        return 'text-dark';
    }
}

@Pipe({name: 'typeClass_bg'})
export class TypeClassBg implements PipeTransform {
    transform(value: Type | undefined): string {        
        if (value === Type.Info) return 'bg-light';
        if (value === Type.Warning) return 'bg-warning';
        if (value === Type.Error) return 'bg-danger';
        return 'bg-dark';
    }
}

@Pipe({name: 'typeClass_text_bg'})
export class TypeClassTextBg implements PipeTransform {
    transform(value: Type | undefined): string {        
        if (value === Type.Info) return 'text-bg-light';
        if (value === Type.Warning) return 'text-bg-warning';
        if (value === Type.Error) return 'text-bg-danger';
        return 'text-bg-dark';
    }
}

@Pipe({name: 'typeClass_btn'})
export class TypeClassBtn implements PipeTransform {
    transform(value: Type | undefined): string {        
        if (value === Type.Info) return 'btn-light';
        if (value === Type.Warning) return 'btn-warning';
        if (value === Type.Error) return 'btn-danger';
        return 'btn-dark';
    }
}


@Pipe({name: 'originDescription'})
export class OriginDescription implements PipeTransform {
    transform(value: string ): string {        
        if (value ===  "statusCENTRAL") return 'Estado del Sistema Central';
        if (value === "statusTERMINAL") return 'Estado de la Terminal';
        if (value === "statusMP") return 'Estado de Mercado Pago';
        if (value === "statusCash") return 'Estado de Cash';
        if (value === "statusprintersVoucher") return 'Estado de Impresora de Cupón';
        if (value === "statusprintersTICKETS") return 'Estado de Impresora de Tickets';       
        return value;
    }
}
