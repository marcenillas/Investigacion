import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { ValidationService } from '../../../shared/validation/validation.service';
import { User } from '../../user.interfaces';
import { UserService } from '../../user.service';
import { SharedService } from '../../../shared/shared.service';

@Component({
    selector: 'user-form-page',
    templateUrl: './user-form-page.component.html',
    styleUrls: ['./user-form-page.component.css']
})
export class UserFormPageComponent implements OnInit {

    public form: FormGroup;
    public formChanged: boolean = false;
    public showModalWindow: boolean = false;

    get current(): User { return this.form.value as User }

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private sharedService: SharedService,
        public validationService: ValidationService
    ) {
        const fb = new FormBuilder();
        this.form = fb.group({
            userId: [''],
            fullName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            enabled: [true],
            password: ['', [Validators.required, Validators.minLength(6)]],
            user: [false],
            admin: [false],
            operator: [false]
        });

        this.form.valueChanges.subscribe(() => {
            this.formChanged = true;
        });
    }

    onClose(){ 
        if (this.form.touched)
            this.showModalWindow = true; 
        else
            this.router.navigateByUrl('/user');
    }

    onConfirm() { this.router.navigateByUrl('/user'); }

    onCancel() { this.showModalWindow = false; }

    ngOnInit(): void {

        if (!this.router.url.includes('edit')) return;

        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.userService.getById(id)))
            .subscribe(user => {
                if (!user) {
                    this.router.navigateByUrl('/user');
                    return;
                }
                this.form.reset(user);
            });
    }

    onSubmit(): void {        
        if (this.form.invalid) {
            if (this.form.get('password')?.value !== null) {
                this.form.markAllAsTouched();
                return;
            }
        }

        if (this.current.userId) {
            this.userService.patch(this.current)
                .subscribe(t => {
                    this.sharedService.fireToast("Registro modificado con éxito");
                    this.router.navigate(['/user', this.current.userId]);
                });
        }
        else {
            this.userService.post(this.current)
                .subscribe(row => {
                    this.sharedService.fireToast("Registro creado con éxito");
                    this.router.navigate(['/user', row.userId]);
                });
        }
    }
}