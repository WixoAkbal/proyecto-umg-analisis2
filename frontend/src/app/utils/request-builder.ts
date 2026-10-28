import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthService } from "../core/auth.service";
import { Response } from "./types";
import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";

type UrlParams = {
    [param: string]: string | number | boolean | 
    readonly (string | number | boolean)[];   
}

@Injectable({providedIn: 'root'})
export class RequestBuilder {
    
    private _httpClient = inject(HttpClient);
    private _header: any = { "Content-Type": "application/json" };
    private _responseType: any = 'json';

    constructor(
        private readonly _authService: AuthService
    ) { }

    async authorizeRequest() {
        const session = this._authService.getToken();
        if (!session) return session;
        return null;
    }

    async getHeaders(authorize: boolean) {
        if (authorize) {
            const authToken = await this.authorizeRequest();
            if (authToken) return {
                ...this._header,
                "Authorization": `Bearer ${authToken}`
            } 
            else {
                this._authService.logout();
            };
        }
        else return this._header;
    }

    async makeGetRequest(URL: string, params: UrlParams): Promise<Response> {
        const headers = await this.getHeaders(true);
        return new Promise((resolve) => {
            this._httpClient.get<any>(URL, {headers, params, responseType: this._responseType})
                .subscribe({
                    next: (response: Response) => {
                        resolve({ message: response.message, statusCode: response.statusCode });
                    },
                    error: (request: HttpErrorResponse) => {
                        const { error, status } = request;
                        resolve({ message: error.message, statusCode: error.statusCode});
                    }
                });
        })
    }

    async makePostRequest(URL: string, body: object, params: UrlParams): Promise<Response> {
        const headers = await this.getHeaders(true);

        return new Promise((resolve) => {
            this._httpClient.post<any>(URL, body, { headers, params, responseType: this._responseType })
                .subscribe({
                    next: (response: Response) => {
                        console.log(response);
                    },
                    error: (error: HttpErrorResponse) => {
                        console.log(error);
                    }
                });
        });
    }

    async makePostRequestWithoutHeader(URL: string, body: object): Promise<Response> {
        return new Promise((resolve) => {
            this._httpClient.post<any>(URL, body, { responseType: this._responseType })
                .subscribe({
                    next: (response: Response) => {
                        this.showSweetAlert('success', response.message);
                    },
                    error: (error: HttpErrorResponse) => {
                        this.showSweetAlert('error', error.error.message);
                    }
                });
        });
    }

    private showSweetAlert(iconType: SweetAlertIcon, messageEvent: string): void {
        void Swal.fire({
            icon: iconType,
            text: messageEvent,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#7969f2',
            background: '#ffffff',
            color: '#242344',
            allowOutsideClick: false,
        });
    }

}