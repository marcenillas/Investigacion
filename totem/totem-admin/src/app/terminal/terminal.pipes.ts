import { Pipe, PipeTransform } from '@angular/core';
import { Status } from './terminal.interfaces';

@Pipe({name: 'termStatusDescription'})
export class StatusDescription implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.Initializing) return 'Initializing';
        if (value === Status.Online) return 'Online';
        if (value === Status.Offline) return 'Offline';
        if (value === Status.Warning) return 'Warning';
        return 'Unknown';
    }
}

@Pipe({name: 'termStatusClass_border'})
export class StatusClassBorder implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.Initializing) return 'border-light';
        if (value === Status.Online) return 'border-success';
        if (value === Status.Offline) return 'border-danger';
        if (value === Status.Warning) return 'border-warning';
        return 'border-dark';
    }
}

@Pipe({name: 'termStatusClass_text'})
export class StatusClassText implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.Initializing) return 'text-light';
        if (value === Status.Online) return 'text-success';
        if (value === Status.Offline) return 'text-danger';
        if (value === Status.Warning) return 'text-warning';
        return 'text-dark';
    }
}

@Pipe({name: 'termStatusClass_bg'})
export class StatusClassBg implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.Initializing) return 'bg-dark';
        if (value === Status.Online) return 'bg-success';
        if (value === Status.Offline) return 'bg-danger';
        if (value === Status.Warning) return 'bg-warning';
        return 'bg-dark';
    }
}

@Pipe({name: 'termStatusClass_text_bg'})
export class StatusClassTextBg implements PipeTransform {
    transform(value: Status | undefined): string {        
        if (value === Status.Initializing) return 'text-bg-dark';
        if (value === Status.Online) return 'text-bg-success';
        if (value === Status.Offline) return 'text-bg-danger';
        if (value === Status.Warning) return 'text-bg-warning';
        return 'text-bg-dark';
    }
}

@Pipe({name: 'termEnabledClass_text_bg'})
export class EnabledClassTextBg implements PipeTransform {
    transform(value: boolean | undefined): string {  
        return value ? 'text-bg-info' : 'text-bg-secondary';
    }
}