import { HttpHandler, HttpInterceptor, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Preferences }  from '@capacitor/preferences';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(
      Preferences.get({
        key: 'token',
      })
    ).pipe(
      switchMap((data: { value: string }) => {
        const token = data?.value;
        if (token) {
          const updatedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          });
          return next.handle(updatedRequest);
        }
        return next.handle(req);
       })
    )
  };

}
