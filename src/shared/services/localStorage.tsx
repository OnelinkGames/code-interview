import UsersModel from "../models/user";

const LocalStorage = {

    getLocalStorage(): Storage {
        return window.localStorage;
    },

    setLoggedTime(loggedTime: Number): void {
        this.getLocalStorage().setItem("logged_in", loggedTime.toString());
    },

    getLoggedTime(): Number {
        return Number.parseInt(this.getLocalStorage().getItem("logged_in") || "0");
    },

    setExpireTime(expiresIn: Number): void {
        this.getLocalStorage().setItem("expires_in", expiresIn.toString());
    },

    getExpireTime(): Number {
        return Number.parseInt(this.getLocalStorage().getItem("expires_in") || "0");
    },

    setAccessToken(token: string): void {
        this.getLocalStorage().setItem("access_token", token);
    },

    getAccessToken(): string {
        return this.getLocalStorage().getItem("access_token") || "";
    },

    setTokenInfo(tokenInfo: Object): void {
        this.getLocalStorage().setItem("token_info", JSON.stringify(tokenInfo));
    },

    getTokenInfo(): UsersModel {
        return JSON.parse(this.getLocalStorage().getItem("token_info") || "{}");
    }
}

export default LocalStorage;