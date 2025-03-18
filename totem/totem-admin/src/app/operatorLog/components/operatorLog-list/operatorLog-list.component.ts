import { Component, Input } from '@angular/core';
import { OperatorLog, OperatorAction } from '../../operatorLog.interfaces';

@Component({
    selector: 'operatorLog-list',
    templateUrl: './operatorLog-list.component.html',
    styleUrls: ['./operatorLog-list.component.css']
})
export class OperatorLogListComponent {

    public opertorActionEnum = OperatorAction;

    @Input()
    public operatorLogList: OperatorLog[] = [{
        operatorLogId: '',
        operatorEmail: '',
        terminalId: '',
        terminal: {
            terminalId: '...',
            name: '...'
        },
        operatorAction: OperatorAction.Entry,      
        description: '...',
        data: '',
        info:'',
        stamp: new Date(),
    }];
}