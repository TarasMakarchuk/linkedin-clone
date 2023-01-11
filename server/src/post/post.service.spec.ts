import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { User } from '../auth/entity/user.class';
import { FeedPost } from './entity/post.class';
import { PostEntity } from './entity/post.entity';
const httpMocks = require('node-mocks-http');

describe('PostService', () => {
  let postService: PostService;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user.firstName = 'Jon';

  const mockPost: FeedPost = {
    content: 'content',
    createdAt: new Date(),
    author: mockRequest.user,
  };

  const mockPostRepository = {
    createPost: jest.fn().mockImplementation((user: User, feedPost: FeedPost) => {
      return {
        ...feedPost,
        author: user,
      }
    }),
    save: jest.fn().mockImplementation((feedPost: FeedPost) => Promise.resolve({
      id: 1,
      ...feedPost,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        }
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  it('PostController should be defined', () => {
    expect(postService).toBeDefined();
  });

  it('It should create a post', (done: jest.DoneCallback) => {
    postService.createPost(mockRequest.user, mockPost).subscribe((feedPost: FeedPost) => {
      expect(feedPost).toEqual({
        id: expect.any(Number),
        ...mockPost,
      });
      done();
    })
  });

});

