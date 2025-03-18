import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Config } from '../../config.interfaces';
import { ConfigService } from '../../config.service';
import { SharedService } from '../../../shared/shared.service';
import { ValidationService } from '../../../shared/validation/validation.service';
import { STRING_TYPE } from '@angular/compiler';
import { ConfigImage } from '../../../../environments/environmentImage';


@Component({
    selector: 'config-form-page',
    templateUrl: './config-form-page.component.html',
    styleUrls: ['./config-form-page.component.css']
})
export class ConfigFormPageComponent implements OnInit {

    public form: FormGroup;
    public formChanged: boolean = false;
    public showModalWindow: boolean = false;


    constructor(
        private router: Router,
        private configService: ConfigService,
        private sharedService: SharedService,
        public validationService: ValidationService,
    ) {
        const fb = new FormBuilder();
        this.form = fb.group({
            configurationId: [''],
            mpAuthorizationToken: [''],
            mpUserId: [''],
            mpNotificationURL: [''],
            taxPercentage: [0, [Validators.min(0), Validators.max(100), validationService.decimalPointValidator()]],
            TITOTitle: [''],
            TITOLine1: [''],
            TITOLine2: [''],
            TITOLine3: [''],
            logoMPImage: [''],
            logoSielconImage: [''],
            logoSalaImage: [''],
            logoMPImageDataS: [''],
            logoSielconImageDataS: [''],
            logoSalaImageDataS: [''],
            currencySymbol:  ['', [Validators.required]],
            feeBorneClientCharge:[false],

            salaName: [''],
            takeSalaNameConfiguration:[false],
            printCancelTransaction:[false],
            mpExpirateTransaction:[false],
            salaAddress: [''],

        });

        this.form.valueChanges.subscribe(() => {
            this.formChanged = true;
        });
    }

    onClose() {
        if (this.form.touched)
            this.showModalWindow = true;
        else
            this.router.navigateByUrl('/home');
    }

    onConfirm() { this.router.navigateByUrl('/home'); }

    onCancel() { this.showModalWindow = false; }

    @Output()
    public notifyToast: EventEmitter<boolean> = new EventEmitter<boolean>();

    get current(): Config { return this.form.value as Config }

    ngOnInit(): void {
        if (!this.router.url.includes('edit')) return;

        this.configService.getAll()
            .subscribe(config => {
                if (!config) {
                    this.router.navigateByUrl('/home');
                    return;
                }

                this.form.reset(config[0]);
            });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.current.configurationId) {

            console.log('save');
            console.log(this.current);

            this.configService.patch(this.current)
                .subscribe(t => {
                    this.sharedService.fireToast("Registro modificado con éxito");
                    this.router.navigateByUrl('/home');
                });
        }
    }

    
    onFileSelected(event: any, index: number) {
        const fileToUpload = event.target.files[0]
        if (fileToUpload) {
            let configImage: ConfigImage;
            let control: string;
            switch (index) {
                case 1:
                    configImage = this.configService.getImageConfig("logoMP");
                    control = "logoMPImage";
                    break;
                case 2:
                    configImage = this.configService.getImageConfig("logoGeneral");
                    control = "logoSalaImage";
                    break;
                case 3:
                    configImage = this.configService.getImageConfig("logoGeneral");
                    control = "logoSielconImage";
                    break;
            };
            const reader = new FileReader();
            reader.readAsDataURL(fileToUpload);
            reader.onload = (event: any) => {
                const base64String = event.target.result.split(',')[1];
                const imageName = fileToUpload.name;
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const width = img.width;
                    const height = img.height;

                    if (
                        img.height < configImage.minHeight ||
                        img.height > configImage.maxHeight ||
                        img.width < configImage.minWidth ||
                        img.width > configImage.maxWidth
                    ) {
                        this.form.get(control)?.setErrors({ invalidDimensions: true });                        
                    }
                    else {
                        const maxSizeBytes = configImage.maxImageSizeMB * 1024 * 1024;

                        if (fileToUpload.size > maxSizeBytes) {
                            this.form.get(control)?.setErrors({ invalidSize: true });
                        }
                    }
                }


                switch (index) {
                    case 1:
                        this.form.get('logoMPImage')?.setValue(imageName);
                        this.form.get('logoMPImageDataS')?.setValue(base64String);


                        break;
                    case 2:
                        this.form.get('logoSalaImage')?.setValue(imageName);
                        this.form.get('logoSalaImageDataS')?.setValue(base64String);

                        break;
                    case 3:
                        this.form.get('logoSielconImage')?.setValue(imageName);
                        this.form.get('logoSielconImageDataS')?.setValue(base64String);
                        break;

                };

            }

        }
    }

    onFileDelete(index: number, event: Event) {
        console.log('onFileDelete');
        event.preventDefault(); // Evita la acción 
        switch (index) {
            case 1:
                this.form.get('logoMPImage')?.setValue("");
                this.form.get('logoMPImageDataS')?.setValue("");
                break;
            case 2:
                this.form.get('logoSalaImage')?.setValue("");
                this.form.get('logoSalaImageDataS')?.setValue("");

                break;
            case 3:
                this.form.get('logoSielconImage')?.setValue("");
                this.form.get('logoSielconImageDataS')?.setValue("");
                break;

        };
    }   
}

