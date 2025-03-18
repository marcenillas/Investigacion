import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'enabledClass_border'})
export class EnabledClassBorder implements PipeTransform {
    transform(value: boolean | undefined): string {  
        return value ? 'border-success' : 'border-danger';
    }
}

@Pipe({name: 'enabledClass_text_bg'})
export class EnabledClassTextBg implements PipeTransform {
    transform(value: boolean | undefined): string {  
        return value ? 'text-bg-info' : 'text-bg-secondary';
    }
}

@Pipe({name: 'enabledClass_text'})
export class EnabledClassText implements PipeTransform {
    transform(value: boolean | undefined): string {  
        return value  ? 'text-success' : 'text-danger';
    }
}