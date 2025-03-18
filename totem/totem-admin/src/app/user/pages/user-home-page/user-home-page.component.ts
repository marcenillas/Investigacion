import { Component, OnInit } from '@angular/core';

import { User } from '../../../user/user.interfaces';

import { UserService } from '../../../user/user.service';

@Component({
    selector: 'user-home-page',
    templateUrl: './user-home-page.component.html',
    styleUrls: ['./user-home-page.component.css']
})
export class UserHomePageComponent implements OnInit {

    public title = 'SIELCON Pay Admin';

    public loading = true;

    public dataRows: User[] = [];

    constructor(
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.userService.getAll().subscribe(
            rows => {
                this.dataRows = rows;
                this.loading = false;
            });
    }
}