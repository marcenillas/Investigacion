import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Status, Terminal } from '../../terminal.interfaces';
import { TerminalService } from '../../terminal.service';

@Component({
    selector: 'terminal-page',
    templateUrl: './terminal-page.component.html',
    styleUrls: ['./terminal-page.component.css']
})
export class TerminalPageComponent implements OnInit {

    public terminal?: Terminal;
    public statusEnum = Status;
    public showModalWindow: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private terminalService: TerminalService,
    ) { }

    showModal(){ this.showModalWindow = true; }

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.terminalService.getById(id)))
            .subscribe(terminal => {
                if (!terminal) {
                    this.router.navigateByUrl('/home');
                } else {
                    this.terminal = terminal;
                }
            });
    }

    onConfirm() {
        this.terminalService.deleteById(this.terminal!.terminalId)
            .subscribe(() => this.router.navigateByUrl('/home'));
    }

    onCancel() { this.showModalWindow = false; }
}