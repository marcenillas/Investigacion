import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ValidationService } from '../../../shared/validation/validation.service';
import { User } from '../../user.interfaces';
import { UserService } from '../../user.service';
import { SharedService } from '../../../shared/shared.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'user-account-page',
    templateUrl: './user-account-page.component.html',
    styleUrls: ['./user-account-page.component.css']
})
export class UserAccountPageComponent {

    private authService = inject(AuthService);
    private userService = inject(UserService);
    private sharedService = inject(SharedService);

    public user = computed(() => this.authService.currentUser());

    public form: FormGroup;
    public formChanged: boolean = false;
    public showModalWindow: boolean = false;

    get current(): User { return this.form.value as User }

    constructor(
        public validationService: ValidationService,
        private router: Router,
    ) {
        const fb = new FormBuilder();
        this.form = fb.group({
            userId: [''],
            fullName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            newPassword: ['', [Validators.minLength(6)]],
            confirmPassword: ['', [Validators.minLength(6)]],
        }, {
            validators: [this.validationService.equals('newPassword', 'confirmPassword')]
        });

        this.form.valueChanges.subscribe(() => {
            this.formChanged = true;
        });
    }

    getSession(): string { return this.authService.getSession().fullName; }

    onClose() {
        if (this.form.touched)
            this.showModalWindow = true;
        else
            this.router.navigateByUrl('/home');
    }

    onConfirm() { this.router.navigateByUrl('/home'); }

    onCancel() { this.showModalWindow = false; }

    ngOnInit(): void {
        if (!this.router.url.includes('account')) return;

        this.userService.getById(this.authService.getSession().userId)
            .subscribe(user => {
                if (!user) {
                    this.router.navigateByUrl('/home');
                    return;
                }
                this.form.reset(user);
            });
    }

    onSubmit(): void {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.authService.account(this.current).subscribe(
            {
                next: () => {
                    this.sharedService.fireToast("Registro modificado con éxito");
                    this.router.navigate(['/home']);
                },
                error: (r) => {
                    if (r.error.statusCode == 401)
                        this.sharedService.fireToast("Credenciales inválidas");
                }
            }
        );
    }
}