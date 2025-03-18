import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { OperatorLog } from '../../operatorLog.interfaces';
import { OperatorLogService } from '../../operatorLog.service';

@Component({
    selector: 'operatorLog-page',
    templateUrl: './operatorLog-page.component.html',
    styleUrls: ['./operatorLog-page.component.css']
})
export class OperatorLogPageComponent implements OnInit {

    public OperatorLog?: OperatorLog;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private OperatorLogService: OperatorLogService,
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.OperatorLogService.getById(id)))
            .subscribe(OperatorLog => {
                if (!OperatorLog) {
                    this.router.navigateByUrl('/home');
                } else {
                    this.OperatorLog = OperatorLog;
                }
            });
    }
}