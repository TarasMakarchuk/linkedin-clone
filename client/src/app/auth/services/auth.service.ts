import { Injectable } from '@angular/core';
import { NewUser } from '../models/new-user.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient, private router: Router) { }

  register(user: NewUser): Observable<User> {
    return this.http.post<User>(
      `${environment.baseApiUrl}/auth/registration`,
      user,
      this.httpOptions,
    )
      .pipe(take(1));
  };

}
