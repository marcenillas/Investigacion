import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { AuthStatus } from '../../../auth/auth.interfaces';

@Component({
    selector: 'login-layout-page',
    templateUrl: './login-layout-page.component.html',
    styles: []
})
export class LoginLayoutPageComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    public finishedAuthCheck = computed<boolean>(() => {

        if (this.authService.authStatus() === AuthStatus.checking) {
            return false;
        }

        return true;
    });

    public authStatusChangedEffect = effect(() => {
        switch (this.authService.authStatus()) {
            case AuthStatus.checking:
                return;
            case AuthStatus.authenticated:
                this.router.navigateByUrl('/home');
                return;
            case AuthStatus.notAuthenticated:
                this.router.navigateByUrl('/auth/login');
                return;
        }
    });
}