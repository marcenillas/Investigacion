import { Component } from '@angular/core';

@Component({
    selector: 'terminal-layout-page',
    templateUrl: './terminal-layout-page.component.html',
    styles: [
    ]
})
export class TerminalLayoutPageComponent {
    public toast: boolean = false;

    get showToast(): boolean { return this.toast }

    public handleNotification(value: boolean) {
        console.log('handleNotification', value);

        this.toast = value;
    }
}