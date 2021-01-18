import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

// creating an interface to define the return type of the http post request:
interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    constructor(private http: HttpClient) {}

    // in the url need to replace the [API_KEY] with the your own Firebase api key
    // need to attach a javascript object based on firebase api authentication requirements
    // only returns an observable, need to subscribe in that component where we need the return response from the http request
    // post<AuthResponseData> we define the response data from the http post request
    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCGeB_nbqGRKwNW5-P11a7J94rj4CehLiA', 
        {
            email: email,
            password: password,
            returnSecureToken: true
        },
        ).pipe(catchError(errorResponse => {
            let errorMessage = 'An unknown error occured!';
            if(!errorResponse.error || !errorResponse.error.error) {
                return throwError(errorMessage);
            }
            switch(errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'The email address is already in use by another account';
                    break;
                case 'OPERATION_NOT_ALLOWED':
                    errorMessage = 'Password sign-in is disabled for this project';
                    break;
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                    errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later';
                    break;
            }
            return throwError(errorMessage);
        }));
    }
}