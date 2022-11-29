import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }

  getSelectedPosts(params) {
    return this.http.get<Post[]>(`${environment.baseApiUrl}/posts${params}`);
  };

}
