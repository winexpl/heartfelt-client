import { inject } from "@angular/core"
import { AuthService } from "./auth.service"
import { Router } from "@angular/router";

export const canActivateAuth = () => {
    const isLoggedIn = inject(AuthService).isAuth

    console.log(isLoggedIn)
    if(isLoggedIn) {
        return true
    } else {
        console.log("canActivateAuth")
        return inject(Router).createUrlTree(['login'])
    }
}