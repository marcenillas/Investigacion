import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { ValidationService } from '../../../shared/validation/validation.service';
import { Terminal } from '../../terminal.interfaces';
import { TerminalService } from '../../terminal.service';
import { SharedService } from '../../../shared/shared.service';
import { ConfigImage } from '../../../../environments/environmentImage';
import { ConfigService } from '../../../config/config.service';

@Component({
    selector: 'terminal-form-page',
    templateUrl: './terminal-form-page.component.html',
    styleUrls: ['./terminal-form-page.component.css']
})
export class TerminalFormPageComponent implements OnInit {

    public form: FormGroup;
    public formChanged: boolean = false;
    public showModalWindow: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private terminalService: TerminalService,
        public validationService: ValidationService,
        private sharedService: SharedService,
        private configService: ConfigService,
    ) {
        const fb = new FormBuilder();
        this.form = fb.group({
            terminalId: [''],
            name: ['', [Validators.required]],
            description: [''],
            enabled: [false],
            status: [0],
            modeQR: [true],
            modeFixed: [false],
            definedValues: [''],
            printTicket: [false],
            printTITO: [false],
            printerTITOCom: [''],
            printerTicketName: [''],
            storeId: [''],
            posId: [''],
            carrouselImage01: [''],
            carrouselImage02: [''],
            carrouselImage03: [''],
            carrouselImage04: [''],
            carrouselImage05: [''],
            carrouselImageData01S: [''],
            carrouselImageData02S: [''],
            carrouselImageData03S: [''],
            carrouselImageData04S: [''],
            carrouselImageData05S: [''],            
            code:  ['', [Validators.required]],
            useCashier: [false],
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

    get current(): Terminal { return this.form.value as Terminal }

    ngOnInit(): void {

        if (!this.router.url.includes('edit')) return;

        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.terminalService.getById(id)))
            .subscribe(terminal => {
                if (!terminal) {
                    this.router.navigateByUrl('/home');
                    return;
                }
                this.form.reset(terminal);
            });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (this.current.terminalId) {
            this.terminalService.patch(this.current)
                .subscribe(t => {
                    this.sharedService.fireToast("Registro modificado con éxito");
                    this.router.navigate(['/terminal', this.current.terminalId]);
                });
        }
        else {
            this.terminalService.post(this.current)
                .subscribe(row => {
                    this.sharedService.fireToast("Registro creado con éxito");
                    this.router.navigate(['/terminal', row.terminalId]);
                });
        }
    }
    onFileSelected(event: any, index: number) {
        const fileToUpload = event.target.files[0]
        if (fileToUpload) {

            let configImage: ConfigImage;
            let control: string;
            configImage = this.configService.getImageConfig("logoCarrusel");
            switch (index) {
                case 1:
                    control = "carrouselImage01";
                    break;
                case 2:
                    control = "carrouselImage02";
                    break;
                case 3:
                    control = "carrouselImage03";
                    break;
                case 4:
                    control = "carrouselImag04";
                    break;
                case 5:
                    control = "carrouselImage05";
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
                        this.form.get('carrouselImage01')?.setValue(imageName);
                        this.form.get('carrouselImageData01S')?.setValue(base64String);
                        break;
                    case 2:
                        this.form.get('carrouselImage02')?.setValue(imageName);
                        this.form.get('carrouselImageData02S')?.setValue(base64String);
                        break;
                    case 3:
                        this.form.get('carrouselImage03')?.setValue(imageName);
                        this.form.get('carrouselImageData03S')?.setValue(base64String);
                        break;
                    case 4:
                        this.form.get('carrouselImage04')?.setValue(imageName);
                        this.form.get('carrouselImageData04S')?.setValue(base64String);
                        break;
                    case 5:
                        this.form.get('carrouselImage05')?.setValue(imageName);
                        this.form.get('carrouselImageData05S')?.setValue(base64String);
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
                this.form.get('carrouselImage01')?.setValue("");
                this.form.get('carrouselImageData01S')?.setValue("");
                break;
            case 2:
                this.form.get('carrouselImage02')?.setValue("");
                this.form.get('carrouselImageData02S')?.setValue("");
                break;
            case 3:
                this.form.get('carrouselImage03')?.setValue("");
                this.form.get('carrouselImageData03S')?.setValue("");
                break;
            case 4:
                this.form.get('carrouselImage04')?.setValue("");
                this.form.get('carrouselImageData04S')?.setValue("");
                break;
            case 5:
                this.form.get('carrouselImage05')?.setValue("");
                this.form.get('carrouselImageData05S')?.setValue("");
                break;
        };
    }
}