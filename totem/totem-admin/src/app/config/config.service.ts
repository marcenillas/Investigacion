import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Config } from './config.interfaces';
import { environment } from '../../environments/environment';
import { ConfigImage, environmentImage } from '../../environments/environmentImage';
import { ConfigJsonService } from '../services/configJson.service';

@Injectable({ providedIn: 'root' })
export class ConfigService {    

    constructor(private configService: ConfigJsonService,private http: HttpClient) { }

    getAll():Observable<Config[]> {
        return this.http.get<Config[]>(`${ this.configService.baseUrl }/configuration`);        
    }

    patch( row: Config ): Observable<Config> {
        if ( !row.configurationId ) throw Error('Row id is required');        
        return this.http.patch<Config>(`${ this.configService.baseUrl }/configuration/${ row.configurationId }`, row );
    }
    

     getImageConfig(logoName: string) : ConfigImage  {
       return environmentImage.configImage[logoName];
     }
    
    
}