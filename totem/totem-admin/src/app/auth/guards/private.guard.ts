import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthStatus } from '../auth.interfaces';

export const PrivateGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.authStatus() === AuthStatus.authenticated) {
        return true;
    }

    router.navigateByUrl('/auth/login');
    return false;
};
