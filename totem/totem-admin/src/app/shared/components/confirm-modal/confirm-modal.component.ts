import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'shared-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {

    @Input() show: boolean = false;
    @Input() message: string = '';
    @Output() confirmed: EventEmitter<void> = new EventEmitter<void>();
    @Output() canceled: EventEmitter<void> = new EventEmitter<void>();

    confirm(): void {
        this.confirmed.emit();
        this.show = false;
    }

    hide(): void {
        this.canceled.emit();
        this.show = false;
    }
}