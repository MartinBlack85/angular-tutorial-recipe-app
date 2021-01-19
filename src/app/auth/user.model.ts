
//Each time at login a new user object will be created
export class User {

    constructor(
        public email: string, 
        public id: string, 
        private _token: string, 
        private _tokenExpirationDate: Date 
    ) {}

    get token() {
        // if the current date (new Date()) is bigger then the token expiration date, it means the login token's time is expired
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}
