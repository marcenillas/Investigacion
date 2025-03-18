import { Component, EventEmitter, Input, IterableDiffers, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Status, Terminal } from '../../transaction.interfaces';
import { Filter } from '../../transaction.interfaces';
import { TerminalService } from '../../../terminal/terminal.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PaginationDTO } from '../../../../../../sielcon-pay-backend/src/common/dtos/pagination.data';

@Component({
  selector: 'app-transaction-information',
  templateUrl: './transaction-information.component.html',
  styleUrl: './transaction-information.component.css'
})
export class TransactionInformationComponent implements OnInit {

  @Input() informationmsg: string = '';
  @Input() show: boolean = false;
  @Output() canceled: EventEmitter<void | undefined> = new EventEmitter<void>();

  ngOnInit(): void {

  }

  hide(): void {
      this.canceled.emit();
      this.show = false;
  }
}