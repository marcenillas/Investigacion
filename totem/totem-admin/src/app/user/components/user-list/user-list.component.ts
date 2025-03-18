import { Component, Input } from '@angular/core';
import { User } from '../../user.interfaces';

@Component({
	selector: 'user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
	@Input()
	public userList: User[] = [{
		userId:'',
		fullName: '...',
		email: '...',
        password: '...',
        enabled: false,
        user: false,
        admin: false,
        operator: false
	}];
}