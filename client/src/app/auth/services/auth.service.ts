import { Injectable } from '@angular/core';
import { NewUser } from '../models/new-user.model';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Role, User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Preferences }  from '@capacitor/preferences';
import { UserResponse } from '../models/user-response.model';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  private user$ = new BehaviorSubject<User>(null);

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  get userStream(): Observable<User> {
    return this.user$.asObservable();
  };

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    );
  };

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.role);
      })
    );
  };

  get userId(): Observable<number> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.id);
      })
    );
  };

  get userFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const fullName = `${user.firstName} ${user.lastName}`;
        return of(fullName);
      })
    );
  };

  get userImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const doesUserHaveImage = !!user?.imagePath;
        let fullImagePath = this.getDefaultUserImagePath();
        if (doesUserHaveImage) {
          fullImagePath = this.getUserImagePath(user.imagePath);
        }
        return of(fullImagePath);
      })
    );
  };

  getDefaultUserImagePath(): string {
    return `${environment.baseApiUrl}/post/image/default-avatar.png`;
  };

  getUserImagePath(imageName: string): string {
    return `${environment.baseApiUrl}/post/image/${imageName}`;
  };

  getUserImage() {
    return this.http
      .get(`${environment.baseApiUrl}/user/image`)
      .pipe(take(1));
  };

  updateUserImagePath(imagePath: string): Observable<User> {
    return this.user$.pipe(
      take(1),
      map((user: User) => {
        user.imagePath = imagePath;
        this.user$.next(user);
        return user;
      })
    );
  };

  getUserImageName(): Observable<{ imageName: string }> {
    return this.http
      .get<{ imageName: string }>(`${environment.baseApiUrl}/user/image-name`)
      .pipe(take(1));
  };

  uploadUserImage(formData: FormData): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(
      `${environment.baseApiUrl}/user/upload`,
      formData,
    )
      .pipe(
        tap(({ modifiedFileName }) => {
          let user = this.user$.value;
          user.imagePath = modifiedFileName;
          this.user$.next(user);
        })
      );
  };

  register(user: NewUser): Observable<User> {
    return this.http.post<User>(
      `${environment.baseApiUrl}/auth/registration`,
      user,
      this.httpOptions,
    )
      .pipe(take(1));
  };

  login(email: string, password: string): Observable<{ token: string }> {
    console.log(email, password);
    return this.http.post<{ token: string }>(
      `${environment.baseApiUrl}/auth/login`,
      { email, password },
      this.httpOptions,
    ).pipe(
      take(1),
      tap((response: { token: string }) => {
         from(Preferences.set({
          key: 'token',
          value: response.token,
        }));
        const decodedToken: UserResponse = jwt_decode(response.token);
        this.user$.next(decodedToken.user);
      }),
    );
  };

  isTokenOnStorage(): Observable<boolean> {
    return from(Preferences.get({
      key: 'token',
    })).pipe(
      map((data: { value: string }) => {
        if (!data || !data.value) return false;
        const decodedToken: UserResponse = jwt_decode(data.value);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired = new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if (isExpired) return false;
        if (decodedToken.user) {
          this.user$.next(decodedToken.user);
          return true;
        }
      })
    );
  };

  logout(): void {
    this.user$.next(null);
    from(Preferences.remove({ key: 'token' }));
    from(this.router.navigateByUrl(`/auth`));
  };

}
