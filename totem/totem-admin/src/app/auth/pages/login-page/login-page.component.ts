import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ValidationService } from '../../../shared/validation/validation.service';
import { AuthService } from '../../auth.service';
import { Auth } from '../../auth.interfaces';

@Component({
    selector: 'login-page',
    templateUrl: './login-page.component.html',
    styles: []
})
export class LoginPageComponent {

    public form: FormGroup;
    public loading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        public validationService: ValidationService
    ) {
        const fb = new FormBuilder();
        this.form = fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    get auth(): Auth { return this.form.value as Auth }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        
        this.authService.login(this.auth.email, this.auth.password)
        .subscribe({
            next: () => {                
                this.loading = false
                this.router.navigate(['/home']);
            },
            error: err => {
                this.loading = false
                console.log(err)
            }
        });
    }
}