import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Filter, OperatorAction,  } from '../../operatorLog.interfaces';
import { TerminalService } from '../../../terminal/terminal.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../../user/user.service';

@Component({
    selector: 'operatorLog-filter',
    templateUrl: './operatorLog-filter.component.html',
    styleUrls: ['./operatorLog-filter.component.css']
})
export class OperatorLogFilterComponent implements OnInit {

    @ViewChildren('terminal') checkboxesTerminal: QueryList<any> | undefined;
    @ViewChildren('action') checkboxesAction: QueryList<any> | undefined;
    @ViewChildren('operator') checkboxesOperator :QueryList<any> | undefined;

    @ViewChildren('terminalAll') checkboxTerminalAll: QueryList<any> | undefined;
    @ViewChildren('actionAll') checkboxesActionAll: QueryList<any> | undefined;
    @ViewChildren('operatorAll') checkboxesOperatorAll: QueryList<any> | undefined;

    public filter: Filter =
        {
            from: '',
            to: '',                                   
            terminalList: [],
            operatorList: [],         
            operatorActionList:[],                        
        }

    public tomorrow: string;

    public form: FormGroup;
    public formChanged: boolean = false;

    @Input() show: boolean = false;

    @Output() confirmed: EventEmitter<Filter | undefined> = new EventEmitter<Filter | undefined>();
    @Output() canceled: EventEmitter<void> = new EventEmitter<void>();

    constructor(private terminalService: TerminalService  ,private userService : UserService) {
        const today = new Date();

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const tomorrow = new Date(today);
        tomorrow.setDate(yesterday.getDate() + 1);
        this.tomorrow = this.formatDate(tomorrow);

        this.filter.from = this.formatDate(yesterday);
        this.filter.to = this.formatDate(new Date());
      

        const fb = new FormBuilder();
        this.form = fb.group({
        
            from: [this.filter.from],
            to: [this.filter.to],
            operatorList:new FormArray([]),
            terminalList: new FormArray([]),
            operatorActionList: new FormArray([]),
        });


        this.form.valueChanges.subscribe(() => {
            this.formChanged = true;
        });
    }

    initDate() {

        const today = new Date();

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

   
        this.form.get('from')?.setValue( this.formatDate(yesterday));
        this.form.get('to')?.setValue( this.formatDate(new Date()));

    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    onCheckboxOperatorAllChange(OperatorLog: any) {
        this.checkboxesOperator!.forEach((checkbox) => {
            checkbox.nativeElement.checked = OperatorLog.target.checked;
        });

        const vchecked = OperatorLog.target.checked;
        const checkedArray = this.form.get('operatorList') as FormArray        
        if (vchecked) {
            this.filter.operatorList.forEach((item) => {
                if (item.email != null) {
                    const exists = checkedArray.controls.some(control => control.value === item.email);
                    if (!exists) {
                        checkedArray.push(new FormControl(item.email))
                    }
                }
            });
        }
        else {
            checkedArray.clear();
        }
        
    }

    onCheckboxTerminalAllChange(OperatorLog: any) {
        this.checkboxesTerminal!.forEach((checkbox) => {
            checkbox.nativeElement.checked = OperatorLog.target.checked;
        });

        const vchecked = OperatorLog.target.checked;
        const checkedArray = this.form.get('terminalList') as FormArray        
        if (vchecked) {
            this.filter.terminalList.forEach((item) => {
                if (item.terminalId != null) {
                    const exists = checkedArray.controls.some(control => control.value === item.terminalId);
                    if (!exists) {
                        checkedArray.push(new FormControl(item.terminalId))
                    }
                }
            });
        }
        else {
            checkedArray.clear();
        }        
    }

    onCheckboxActionAllChange(OperatorLog: any) {
        this.checkboxesAction!.forEach((checkbox) => {
            checkbox.nativeElement.checked = OperatorLog.target.checked;
        });

        const vchecked = OperatorLog.target.checked;
        const checkedArray = this.form.get('operatorActionList') as FormArray
        if (vchecked) {
            Object.values(OperatorAction).forEach(status => {
                if (typeof status === 'number') {
                    if (status != null) {
                        const exists = checkedArray.controls.some(control => control.value === status);
                        if (!exists) {
                            checkedArray.push(new FormControl(status));
                        }
                    }
                }
            });
        }
        else {
            checkedArray.clear();
        }
    }

    onCheckboxOperatorChange(OperatorLog: any) {
        const checkedValue = OperatorLog.target.value
        const vchecked = OperatorLog.target.checked;
        const checkedArray = this.form.get('operatorList') as FormArray
        if (vchecked) {
            checkedArray.push(new FormControl(checkedValue))
        }
        else {
            let i: number = 0
            checkedArray.controls.forEach((item) => {
                if (item.value == checkedValue) {
                    checkedArray.removeAt(i);
                }
                i++
            });
        }


        let checked: boolean = true;

        if (!OperatorLog.target.checked) this.checkboxesOperatorAll!.first.nativeElement.checked = false;
        else {
            this.checkboxesOperator!.forEach((checkbox) => {
                if (!checkbox.nativeElement.checked) checked = false;
            });

            this.checkboxesOperatorAll!.first.nativeElement.checked = checked;
        }
    }

    onCheckboxTerminalChange(OperatorLog: any) {
        const checkedValue = OperatorLog.target.value
        const vchecked = OperatorLog.target.checked;
        const checkedArray = this.form.get('terminalList') as FormArray
        if (vchecked) {
            checkedArray.push(new FormControl(checkedValue))
        }
        else {
            let i: number = 0
            checkedArray.controls.forEach((item) => {
                if (item.value == checkedValue) {
                    checkedArray.removeAt(i);
                }
                i++
            });
        }


        let checked: boolean = true;

        if (!OperatorLog.target.checked) this.checkboxTerminalAll!.first.nativeElement.checked = false;
        else {
            this.checkboxesTerminal!.forEach((checkbox) => {
                if (!checkbox.nativeElement.checked) checked = false;
            });

            this.checkboxTerminalAll!.first.nativeElement.checked = checked;
        }
    }

    onCheckboxActionChange(OperatorLog: any) {
        const checkedValue = OperatorLog.target.value
        const vchecked = OperatorLog.target.checked;
        const checkedArray = this.form.get('operatorActionList') as FormArray
        if (vchecked) {
            checkedArray.push(new FormControl(checkedValue))
        }
        else {
            let i: number = 0
            checkedArray.controls.forEach((item) => {
                if (item.value == checkedValue) {
                    checkedArray.removeAt(i);
                }
                i++
            });
        }

        let checked: boolean = true;

        if (!OperatorLog.target.checked) this.checkboxesActionAll!.first.nativeElement.checked = false;
        else {
            this.checkboxesAction!.forEach((checkbox) => {
                if (!checkbox.nativeElement.checked) checked = false;
            });

            this.checkboxesActionAll!.first.nativeElement.checked = checked;
        }
    }

    ngOnInit(): void {
        this.terminalService.getAll().subscribe(
            rows => {
                this.filter.terminalList = rows
                const checkedArray = this.form.get('terminalList') as FormArray
                this.filter.terminalList.forEach((item) => {
                    checkedArray.push(new FormControl(item.terminalId))
                });
            });


            this.userService.getAll().subscribe(
                rows => {
                    this.filter.operatorList = rows
                    const checkedArray = this.form.get('operatorList') as FormArray
                    this.filter.operatorList.forEach((item) => {
                        checkedArray.push(new FormControl(item.email))
                    });
                });
    

        const checkedArrayS = this.form.get('operatorActionList') as FormArray
        Object.values(OperatorAction).forEach(status => {
            if (typeof status === 'number') {
                this.filter.operatorActionList.push(status);
                checkedArrayS.push(new FormControl(status))
            }
        });
    }

    confirm(): void {

        console.log(this.form.value as Filter)
        this.confirmed.emit(this.form.value as Filter);
        this.show = false;
    }

    hide(): void {
        this.canceled.emit();
        this.show = false;
    }
}