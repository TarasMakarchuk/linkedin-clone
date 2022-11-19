import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { NUMBER_OF_POSTS, SKIP_POSTS } from '../../constants/infinite-scroll.constants';
import { Post } from '../../models/Post';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = NUMBER_OF_POSTS;
  skipPosts = 0;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.getPosts(false, '');
  };

  getPosts(isInitialLoad: boolean, event) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postService.getSelectedPosts(this.queryParams).subscribe((posts: Post[]) => {
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

}
