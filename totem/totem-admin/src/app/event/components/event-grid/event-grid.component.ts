import { Component, Input, ViewChild } from '@angular/core';
import { Event, Filter, Type } from '../../event.interfaces';
import { Terminal } from '../../../terminal/terminal.interfaces';
import { EventService } from '../../event.service';
import { EventFilterComponent } from '../event-filter/event-filter.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'event-grid',
    templateUrl: './event-grid.component.html',
    styleUrls: ['./event-grid.component.css']
})
export class EventGridComponent {

    @ViewChild(EventFilterComponent) eventFilterComponent!: EventFilterComponent;
    public loading = false;
    public showModalWindow: boolean = false;
    public form: FormGroup;


    @Input()
    public eventList: Event[] = [{
        eventId: 0,
        type: Type.Info,
        name: '...',
        description: '...',
        stamp: new Date(),
        terminalId: 0,
        terminal: {
            terminalId: '...',
            name: '...'
        },
        origin: '...',
        state: '...',
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
        private eventService: EventService,
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


            this.eventService.getByFilter(this.currentFilter).subscribe(
                rowsd => {

                    this.eventList = rowsd.data
                    this.dataCount = rowsd.count
                    this.maxVisiblePages = Math.min(Math.ceil(this.dataCount / this.itemsPerPage), 3);
                    this.updateVisiblePages();
                });
        }
        else {
            this.eventService.getAll({ offset: page - 1, limit: this.itemsPerPage }).subscribe(
                rowsd => {

                    this.eventList = rowsd.data
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

        if (this.eventFilterComponent && this.eventFilterComponent.form) {
            const fakeChangeEvent = {
                target: { checked: true }
            };

            this.eventFilterComponent.initDate()
            this.eventFilterComponent.onCheckboxTerminalAllChange(fakeChangeEvent);
            this.eventFilterComponent.onCheckboxTypeAllChange(fakeChangeEvent);

            this.currentFilter = null;
            this.changePage(1);
        }
    }

    refresh() {
        this.changePage(this.currentPage);
    }
  
}





