import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const cloned = req.clone({
      withCredentials: true,
    });

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        const isAuthRequest =
          req.url.includes('/login') || req.url.includes('/google-login');

        if (error.status === 401 && !isAuthRequest) {
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      }),
    );
  }
}
