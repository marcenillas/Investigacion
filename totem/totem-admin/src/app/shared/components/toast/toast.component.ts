import { Component, Input } from '@angular/core';
import { SharedService } from '../../shared.service'

@Component({
	selector: 'shared-toast',
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.css']
})
export class ToastComponent {

    @Input()
    public toast: boolean = false;

    @Input()
    public message: string = '';

    hideToast() { this.toast = false; }

	constructor(sharedService: SharedService) {
        sharedService.toastEvent.subscribe((message: string) => {
            this.toast = true;
            this.message = message

            setTimeout(() => this.hideToast(), 3000);
        });
    }
}