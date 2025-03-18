import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Terminal } from '../../../terminal/terminal.interfaces';
import { Filter, Type } from '../../event.interfaces';
import { TerminalService } from '../../../terminal/terminal.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'event-filter',
    templateUrl: './event-filter.component.html',
    styleUrls: ['./event-filter.component.css']
})
export class EventFilterComponent implements OnInit {

    @ViewChildren('terminal') checkboxesTerminal: QueryList<any> | undefined;
    @ViewChildren('type') checkboxesType: QueryList<any> | undefined;

    @ViewChildren('terminalAll') checkboxTerminalAll: QueryList<any> | undefined;
    @ViewChildren('typeAll') checkboxTypeAll: QueryList<any> | undefined;

    public filter: Filter =
        {
            from: '',
            to: '',
            terminalList: [],
            typeList: [],

        }

    public tomorrow: string;

    public form: FormGroup;
    public formChanged: boolean = false;

    @Input() show: boolean = false;

    @Output() confirmed: EventEmitter<Filter | undefined> = new EventEmitter<Filter | undefined>();
    @Output() canceled: EventEmitter<void> = new EventEmitter<void>();

    constructor(private terminalService: TerminalService) {
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
            terminalList: new FormArray([]),
            typeList: new FormArray([]),
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

    onCheckboxTerminalAllChange(event: any) {
        this.checkboxesTerminal!.forEach((checkbox) => {
            checkbox.nativeElement.checked = event.target.checked;
        });

        const vchecked = event.target.checked;
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

    onCheckboxTypeAllChange(event: any) {
        this.checkboxesType!.forEach((checkbox) => {
            checkbox.nativeElement.checked = event.target.checked;
        });

        const vchecked = event.target.checked;
        const checkedArray = this.form.get('typeList') as FormArray
        if (vchecked) {
            Object.values(Type).forEach(status => {
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

    onCheckboxTerminalChange(event: any) {
        const checkedValue = event.target.value
        const vchecked = event.target.checked;
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

        if (!event.target.checked) this.checkboxTerminalAll!.first.nativeElement.checked = false;
        else {
            this.checkboxesTerminal!.forEach((checkbox) => {
                if (!checkbox.nativeElement.checked) checked = false;
            });

            this.checkboxTerminalAll!.first.nativeElement.checked = checked;
        }
    }

    onCheckboxTypeChange(event: any) {
        const checkedValue = event.target.value
        const vchecked = event.target.checked;
        const checkedArray = this.form.get('typeList') as FormArray
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

        if (!event.target.checked) this.checkboxTypeAll!.first.nativeElement.checked = false;
        else {
            this.checkboxesType!.forEach((checkbox) => {
                if (!checkbox.nativeElement.checked) checked = false;
            });

            this.checkboxTypeAll!.first.nativeElement.checked = checked;
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


        const checkedArrayS = this.form.get('typeList') as FormArray
        Object.values(Type).forEach(status => {
            if (typeof status === 'number') {
                this.filter.typeList.push(status);
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