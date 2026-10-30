import { Injectable } from "@angular/core";
import { RequestBuilder } from "../../utils/request-builder";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class DropdownServices {


    constructor(
        private readonly _requestBuilder: RequestBuilder
    ) { }

    async getNivelesAcademicos() {
        const { status, result } =  await this._requestBuilder.makeGetRequest(`${environment.API_URL}/dropdown/niveles-academicos`, null);
        if (status) return result;
        return null;
    }
}