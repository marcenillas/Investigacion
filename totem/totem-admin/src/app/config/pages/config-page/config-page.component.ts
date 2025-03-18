import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from '../../config.interfaces';
import { ConfigService } from '../../config.service';

@Component({

    templateUrl: './config-page.component.html',
    styleUrls: ['./config-page.component.css']
})
export class ConfigPageComponent implements OnInit {

    public config?: Config;
    public showModalWindow: boolean = false;

    constructor(
        private router: Router,
        private configService: ConfigService,
    ) { }

    showModal() { this.showModalWindow = true; }

    ngOnInit(): void {
        this.configService.getAll()
            .subscribe(config => {
                if (!config) {
                    this.router.navigateByUrl('/home');
                } else {
                    this.config = config[0];
                }
            });
    }

    onCancel() { this.showModalWindow = false; }
}