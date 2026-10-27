import { Injectable } from "@angular/core";
import { RequestBuilder } from "../../utils/request-builder";
import { NewUserRequest } from "../requests/new-user.request";
import { environment } from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class UserService {
    
    constructor(private readonly _requestBuilder: RequestBuilder) { }

    async registerUser(newUserRequest: NewUserRequest) {
        return await this._requestBuilder.makePostRequestWithoutHeader(`${environment.API_URL}/user/register`, newUserRequest);
    }
}