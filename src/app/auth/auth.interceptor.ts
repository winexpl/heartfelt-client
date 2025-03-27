import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, map, switchMap, tap, throwError } from "rxjs";

let isRefreshing: boolean = false;

export const authTokenInterceptor : HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken()

    if(!token) return next(req)
    if(isRefreshing) return refreshAndProceed(authService, req, next)
    console.log(token + " " + req.url);
    return next(addToken(req, token))
        .pipe(
            catchError( error => {
                if(error.status == 403) {
                    return refreshAndProceed(authService, req, next)
                }
                return throwError(() => error)
            }),
        tap(() => console.log(req))       
    )
}

const refreshAndProceed = (
    authService: AuthService,
    req: HttpRequest<any>,
    next: HttpHandlerFn
) => {
    if(!isRefreshing) {
        isRefreshing = true
        return authService.refresh()
            .pipe(
                switchMap(res => {
                    isRefreshing = false
                    return next(addToken(req, res.accessToken))
                })
            )
    }
    return next(addToken(req, authService.getToken()!))
}

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
} 