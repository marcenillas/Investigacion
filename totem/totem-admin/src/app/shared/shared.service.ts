import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {

    constructor(@Inject(LOCALE_ID) private locale: string) { }

    private _toast: Subject<string> = new Subject<string>();

    public get toastEvent() { return this._toast.asObservable(); }

    public fireToast(message:string) { this._toast.next(message); }

    public getId(): string { return formatDate(Date.now(),'yyMMddHHmmss', this.locale); }
}