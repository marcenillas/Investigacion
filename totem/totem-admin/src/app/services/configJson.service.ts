import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConfigJsonService {
    private config: any;

    constructor() {
        this.loadConfig();
    }

    private loadConfig(): void {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', '/assets/config/config.json', false); // false for synchronous request
        xmlHttp.send(null);
        if (xmlHttp.status === 200) {
            this.config = JSON.parse(xmlHttp.responseText);
        } else {
            console.error('Failed to load configuration');
        }
    }

    get baseUrl(): string {
        return this.config ? this.config.baseUrl : '';
    }

    
}
