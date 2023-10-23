import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class ConfigService {
    constructor(private http: HttpClient) { }

    configUrl = 'https://localhost:7068/api/Auth/login';

    getConfig() {
        let model={"username":"string", "password":"Etepov01!"}

        return this.http.post(this.configUrl,model,
            {headers:{"accept": "*/*", "Content-Type":"application/json"}});
    }

}
