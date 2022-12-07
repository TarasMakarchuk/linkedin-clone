import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';
import { NUMBER_OF_POSTS, SKIP_POSTS } from '../../constants/infinite-scroll.constants';
import { Post } from '../../models/Post';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  constructor(
    private postService: PostService,
    private authService: AuthService,
  ) {}

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @Input() postBody?: string;

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = NUMBER_OF_POSTS;
  skipPosts = 0;
  userId$ = new BehaviorSubject<number>(null);

  ngOnInit() {
    this.getPosts(false, '');
    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId$.next(userId);
    });
  };

  ngOnChanges(changes: SimpleChanges) {
    const postBody = changes.postBody.currentValue;
    if (!postBody) return;
    this.postService.create(postBody).subscribe((post: Post) => {
      this.allLoadedPosts.unshift(post);
    });
  };

  getPosts(isInitialLoad: boolean, event) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postService.getPosts(this.queryParams).subscribe((posts: Post[]) => {
      posts.forEach((post, index) => {
        this.allLoadedPosts.push(posts[index]);
      });
      if (isInitialLoad) event.target.complete();
      this.skipPosts = this.skipPosts + SKIP_POSTS;
    }, (error) => {
      console.log(error);
    });
  };

  fetchData(event) {
    this.getPosts(true, event);
  };

  presentUpdateModal(postId: number) {
    console.log('EDIT POST', postId);
  };

  deletePost(postId: number) {
    this.postService.delete(postId).subscribe(() => {
      this.allLoadedPosts = this.allLoadedPosts.filter(
        (post: Post) => post.id !== postId);
    });
  };

}
