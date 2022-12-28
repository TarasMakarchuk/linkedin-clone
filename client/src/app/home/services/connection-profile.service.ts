import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../auth/models/user.model';
import { FriendRequest, FriendRequestStatus } from '../models/FriendRequest';
import { FriendRequestStatusEnum } from '../models/friend-request.enum';

@Injectable({
  providedIn: 'root'
})
export class ConnectionProfileService {
  constructor(private http: HttpClient) {}

  friendRequests: FriendRequest[];

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getConnectionUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.baseApiUrl}/user/${id}`);
  };

  getFriendRequestStatus(id: number): Observable<FriendRequestStatus> {
    return this.http.get<FriendRequestStatus>(
        `${environment.baseApiUrl}/user/friend-request/status/${id}`
    );
  };

  addConnectionUser(id: number): Observable<FriendRequest | { error: string }> {
    return this.http.post<FriendRequest | { error: string }>(
      `${environment.baseApiUrl}/user/friend-request/send/${id}`,
      {},
      this.httpOptions,
    );
  };

  getFriendRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(
      `${environment.baseApiUrl}/user/friend-request/me/received-requests`
    );
  };

  responseToFriendRequest(
    id: number,
    statusResponse: FriendRequestStatusEnum.ACCEPTED | FriendRequestStatusEnum.DECLINED,
  ): Observable<FriendRequest> {
    return this.http.post<FriendRequest>(
      `${environment.baseApiUrl}/user/friend-request/response/${id}`,
      { status: statusResponse },
      this.httpOptions,
    );
  };

}
