import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from '../../../environments/environment';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService
      .getUserImageName()
      .pipe(
        take(1),
        tap(({imageName}) => {
          const defaultImagePath = 'default-avatar.png';
          this.authService.updateUserImagePath(imageName || defaultImagePath).subscribe();
        }),
      ).subscribe();
  }

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
  };

  getPosts(params) {
    return this.http
      .get<Post[]>(`${environment.baseApiUrl}/posts${params}`);
  };

  create(content: string) {
    return this.http
      .post<Post>(
      `${environment.baseApiUrl}/posts`,
      { content },
      this.httpOptions,
    ).pipe(take(1));
  };

  update(postId: number, content: string) {
    return this.http
      .put<Post>(
      `${environment.baseApiUrl}/posts/${postId}`,
      { content },
      this.httpOptions
    ).pipe(take(1));
  };

  delete(postId: number) {
    return this.http
      .delete<Post>(`${environment.baseApiUrl}/posts/${postId}`)
      .pipe(take(1));
  };

}
