import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ConnectionProfileService {
  constructor(private http: HttpClient) {}

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getConnectionUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.baseApiUrl}/user/${id}`);
  };

}
