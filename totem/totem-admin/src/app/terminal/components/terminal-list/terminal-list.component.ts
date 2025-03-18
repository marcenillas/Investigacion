import { Component, Input } from '@angular/core';
import { Status, Terminal } from '../../terminal.interfaces';

@Component({
	selector: 'terminal-list',
	templateUrl: './terminal-list.component.html',
	styleUrls: ['./terminal-list.component.css']
})
export class TerminalListComponent {

    public statusEnum = Status;

	@Input()
	public terminalList: Terminal[] = [{
		terminalId: '',
		name: '...',
		description: '...',
		enabled: true,
        modeQR: true,
		modeFixed: true,
		status: Status.Initializing,
        printTITO: false,
        printerTITOCom: '',
        printTicket: false,
        printerTicketName: '',
        storeId: '',
        posId: '',
        definedValues: '',
        carrouselImage01: "...",
		carrouselImage02: "...",
		carrouselImage03: "...",
		carrouselImage04: "...",
		carrouselImage05: "...",
        lastTransaction: new Date(),
		lastEvent: new Date(),
		lastConnection: new Date(),
		useCashier:false,
	}];
}