import { Component, Input, ViewChild } from '@angular/core';
import { OperatorLog, Filter, OperatorAction } from '../../operatorLog.interfaces';
import { Terminal } from '../../../terminal/terminal.interfaces';
import { OperatorLogService } from '../../operatorLog.service';
import { OperatorLogFilterComponent } from '../operatorLog-filter/operatorLog-filter.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'operatorLog-grid',
    templateUrl: './operatorLog-grid.component.html',
    styleUrls: ['./operatorLog-grid.component.css']
})
export class OperatorLogGridComponent {

    @ViewChild(OperatorLogFilterComponent) OperatorLogFilterComponent!: OperatorLogFilterComponent;
    public loading = false;
    public showModalWindow: boolean = false;
    public form: FormGroup;


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
        info: '',
        stamp: new Date(),

    }];


    @Input()
    public dataCount: number = 0;

    @Input()
    public currentPage: number = 1;

    @Input()
    public itemsPerPage: number = 50;

    @Input()
    public itemsPerPageOptions: number[] = [10, 20, 50, 100];

    @Input()
    public visiblePages: number[] = [];

    private maxVisiblePages: number = 3;

    private halfMaxVisiblePages: number = Math.floor(this.maxVisiblePages / 2);


    private currentFilter?: Filter | null;


    get totalPages(): number {
        var a = Math.ceil(this.dataCount / this.itemsPerPage);
        return a;
    }

    get totalPagesArray(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    get AddPoints(): boolean {
        var a = false;
        if (this.totalPages > this.maxVisiblePages)
            a = this.currentPage + this.halfMaxVisiblePages < this.totalPages;
        return a
    }


    constructor(
        private OperatorLogService: OperatorLogService,
    ) {

        const fb = new FormBuilder();
        this.form = fb.group({
            itemsPerPage: 50
        });


    }

    showModal() { this.showModalWindow = true; }

    ngOnInit(): void {
        this.loadPage(this.currentPage);
    }

    loadPage(page: number): void {

        if (this.currentFilter) {

            this.currentFilter.offset = page - 1,

                this.currentFilter.limit = this.itemsPerPage


            this.OperatorLogService.getByFilter(this.currentFilter).subscribe(
                rowsd => {
                    if (rowsd.data) {
                        rowsd.data = rowsd.data.map(item => {
                            try {
                                const info = JSON.parse(item.data)?.info || '-'; // Si es null, muestra un guion
                                const updateditem: OperatorLog = {
                                    ...item,
                                    info
                                };
                                return updateditem;
                            } catch (error) {
                                console.error(`Error al obtener datos ${item.description}:`, error);
                                return { ...item, info: '-' };
                            }
                        });
                    };
                    this.operatorLogList = rowsd.data
                    this.dataCount = rowsd.count
                    this.maxVisiblePages = Math.min(Math.ceil(this.dataCount / this.itemsPerPage), 3);
                    this.updateVisiblePages();
                });
        }


















        else {
            this.OperatorLogService.getAll({ offset: page - 1, limit: this.itemsPerPage }).subscribe(
                rowsd => {

                    if (rowsd.data) {
                        rowsd.data = rowsd.data.map(item => {
                            try {
                                const info = JSON.parse(item.data)?.info || '-'; // Si es null, muestra un guion
                                const updateditem: OperatorLog = {
                                    ...item,
                                    info
                                };
                                return updateditem;
                            } catch (error) {
                                console.error(`Error al obtener datos ${item.description}:`, error);
                                return { ...item, info: '-' };
                            }
                        });
                    };

                    this.operatorLogList = rowsd.data
                    this.dataCount = rowsd.count
                    this.maxVisiblePages = Math.min(Math.ceil(this.dataCount / this.itemsPerPage), 3);
                    this.updateVisiblePages();
                });
        }

    }


    changePage(page: number): void {
        this.currentPage = page;
        this.loadPage(page);
    }


    updateVisiblePages(): void {

        if (this.currentPage <= this.halfMaxVisiblePages) {
            this.visiblePages = Array.from({ length: this.maxVisiblePages }, (_, i) => i + 1);
        } else if (this.currentPage >= this.totalPages - this.halfMaxVisiblePages) {
            this.visiblePages = Array.from({ length: this.maxVisiblePages }, (_, i) => this.totalPages - this.maxVisiblePages + i + 1);
        } else {
            this.visiblePages = Array.from({ length: this.maxVisiblePages }, (_, i) => this.currentPage - this.halfMaxVisiblePages + i);
        }
    }


    updateItemsPerPage(item: any): void {
        let val = item.target.value
        if (val) {

            this.itemsPerPage = val;
            this.changePage(1);
        }
    }

    onConfirm(values: Filter | undefined) {
        console.log(values, 'confirm');
        this.showModalWindow = false;
        this.currentFilter = values as Filter;
        this.changePage(1);

    }

    onCancel() { this.showModalWindow = false; }

    resetFilter() {

        if (this.OperatorLogFilterComponent && this.OperatorLogFilterComponent.form) {
            const fakeChangeOperatorLog = {
                target: { checked: true }
            };

            this.OperatorLogFilterComponent.initDate()
            this.OperatorLogFilterComponent.onCheckboxTerminalAllChange(fakeChangeOperatorLog);
            this.OperatorLogFilterComponent.onCheckboxActionAllChange(fakeChangeOperatorLog);

            this.currentFilter = null;
            this.changePage(1);
        }
    }

    refresh() {
        this.changePage(this.currentPage);
    }

}





