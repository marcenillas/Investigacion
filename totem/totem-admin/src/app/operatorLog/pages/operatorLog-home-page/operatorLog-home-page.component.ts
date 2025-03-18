import { Component, OnInit } from '@angular/core';

import { OperatorLog } from '../../../operatorLog/operatorLog.interfaces';

import { OperatorLogService } from '../../../operatorLog/operatorLog.service';

@Component({
    selector: 'operatorLog-home-page',
    templateUrl: './operatorLog-home-page.component.html',
    styleUrls: ['./operatorLog-home-page.component.css']
})
export class OperatorLogHomePageComponent implements OnInit {

    public title = 'SIELCON Pay Admin';

    public loading = true;

    public dataRows: OperatorLog[] = [];

    public dataCount:number = 0; 


    constructor(
        private OperatorLogService: OperatorLogService
    ) { }

    ngOnInit(): void {
        this.OperatorLogService.getAll().subscribe(
            rowsd => {
                this.dataRows = rowsd.data;
                this.dataCount = rowsd.count;
                this.loading = false;
            });
    }
}