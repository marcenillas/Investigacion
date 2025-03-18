import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'shared-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent {

    private authService = inject(AuthService);

    constructor() { }

    public user = computed(() => this.authService.currentUser());

    getSession(): string {
        return `${this.user()?.fullName} (${this.user()?.email})`
    }

    logout(): void {
        this.authService.logout();
    }
}