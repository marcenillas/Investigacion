import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { User } from '../../user.interfaces';
import { UserService } from '../../user.service';

@Component({
    selector: 'user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

    public user?: User;
    public showModalWindow: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService,
    ) { }

    showModal(){ this.showModalWindow = true; }

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.userService.getById(id)))
            .subscribe(user => {
                if (!user) {
                    this.router.navigateByUrl('/user');
                } else {
                    this.user = user;
                }
            });
    }

    onConfirm() {
        this.userService.deleteById(this.user!.userId)
            .subscribe(() => this.router.navigateByUrl('/user'));
    }

    onCancel() { this.showModalWindow = false; }
}