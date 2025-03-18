import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

@Injectable({ providedIn: 'root' })
export class ValidationService {

    public invalidField = (form: FormGroup, field: string): boolean | null => {
        return form.controls[field].errors && form.controls[field].touched;
    }

    public hasErrors = (form: FormGroup, field: string): boolean => {
        if (form.controls[field].errors)
            return true;
        else
            return false;
    }

    public getFieldError = (form: FormGroup, field: string, label: string, extra?: string): string | null => {

        if (!form.controls[field]) return null;

        const errors = form.controls[field].errors || {};

        for (const key of Object.keys(errors)) {
            switch (key) {
                case 'required': return `${label} es requerido`;
                case 'email': return `${label} debe ser un email válido`;
                case 'minlength': return `${label} debe tener una longitud mínima de ${errors['minlength'].requiredLength} caracteres.`;
                case 'notEqual': return `${label} debe coincidir con ${extra}.`;
                case 'min': return `${label} debe ser mayor o igual a ${errors['min'].min}.`;
                case 'max': return `${label} debe ser menor o igual a ${errors['max'].max}.`;
                case 'point': return `${label} debe tener un punto decimal, no una coma.`;
                case 'invalidDimensions': return `${label} las dimensiones no son válidas.`;
                case 'invalidSize': return `${label} el tamaño no es válida.`;
            }
        }

        return null;
    }

    public equals(field1: string, field2: string) {

        return (formGroup: AbstractControl): ValidationErrors | null => {
            if (formGroup.get(field1)?.value !== formGroup.get(field2)?.value) {
                formGroup.get(field2)?.setErrors({ notEqual: true });
                return { notEqual: true }
            }

            formGroup.get(field2)?.setErrors(null);
            return null;
        }
    }

    public decimalPointValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value == null || value === '') {
                return null;
            }
            const regex = /^\d+(\.\d+)?$/;
            const valid = regex.test(value);
            return valid ? null : { point: { value: value } };
        };
    }
}