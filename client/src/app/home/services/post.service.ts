import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { API_ENTRY_POINT_URL } from "../constants/api.constants";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }

  getSelectedPosts(params) {
    return this.http.get<Post[]>(`${API_ENTRY_POINT_URL}/posts${params}`);
  };

}
