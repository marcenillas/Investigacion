import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'defaultString' })
export class DefaultString implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (value === null || value === undefined || value === '') return '-';
        else return value;
    }
}

@Pipe({ name: 'defaultStringForNumbers' })
export class DefaultStringForNumbers implements PipeTransform {
    transform(value: number | null | undefined): string | number {
        if (value === null || value === undefined) return '-';
        else return value;
    }
}

@Pipe({ name: 'defaultStringForDate' })
export class DefaultStringForDate implements PipeTransform {
    transform(value: Date | null | undefined): string | Date {
        if (value === null || value === undefined) return "-";
        else return value;
    }
}

@Pipe({ name: 'enumToArray' })
export class EnumToArrayPipe implements PipeTransform {
    transform(data: Object): number[] {
        const values = Object.values(data);
        return values.slice(values.length / 2);
    }
}

@Pipe({ name: 'booleanToYesNo' })
export class BooleanToYesNo implements PipeTransform {
    transform(value: boolean | null | undefined): string {
        if (value) return "Sí";
        else return "No";
    }
}

@Pipe({ name: 'defaultStringForDecimalNumbers' })
export class DefaultStringForDecimalNumbers implements PipeTransform {
    transform(value: number | null | undefined): string | number {
        if (value === null || value === undefined) return '-';
        else {
            // Redondea a dos decimales
            const roundedValue = Number(value).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            return roundedValue;
        }
    }
}

@Pipe({ name: 'defaultCeroForDecimalNumbers' })
export class DefaultCeroForDecimalNumbers implements PipeTransform {
    transform(value: number | null | undefined): string | number {
        if (value === null || value === undefined) return '0';
        else {
            // Redondea a dos decimales
            const roundedValue = Number(value).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            return roundedValue;
        }
    }
}


@Pipe({ name: 'defaultJsonString', pure: true })
export class DefaultJsonString implements PipeTransform {
    transform(value: any, args: any[]): any {
        try {           
            let a = this.applyColors(
                typeof value === 'object' ? value : this.recursiveJsonParse(value),
                args[0],
                args[1]
            );           
            return a;
        } catch (e) {
            return this.applyColors({ error: 'Invalid JSON' }, args[0], args[1]);
        }
    }

     recursiveJsonParse(jsonString: string): any {
        try {
            const parsedObject = JSON.parse(jsonString, (key, value) => {
                if (typeof value === 'string') {
                    try {
                        return JSON.parse(value);
                    } catch (error) {
                        return value;
                    }
                }
                return value;
            });
            return parsedObject;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
        }
    }


    applyColors(obj: any, showNumebrLine: boolean = false, padding: number = 4) {        
        let line = 1;

        if (typeof obj != 'string') {
            obj = JSON.stringify(obj, undefined, 3);
        }      
        obj = obj.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');    
        obj = obj.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            (match: any) => {                
                let themeClass = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        themeClass = 'key';
                    } else {
                        themeClass = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    themeClass = 'boolean';
                } else if (/null/.test(match)) {
                    themeClass = 'null';
                }
                return '<span class="' + themeClass + '">' + match + '</span>';
            }
        );
      
        return showNumebrLine
            ? obj.replace(
                /^/gm,
                () =>
                    `<span class="number-line pl-3 select-none" >${String(line++).padEnd(padding)}</span>`
            )
            : obj;
    }
}