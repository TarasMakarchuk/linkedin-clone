import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserService } from '../auth/services/user.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../auth/entity/user.class';
import { FeedPost } from './entity/post.class';
const httpMocks = require('node-mocks-http');

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;
  let userService: UserService;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user.firstName = 'Jon';

  const mockPost: FeedPost = {
    content: 'content',
    createdAt: new Date(),
    author: mockRequest.user,
  };

  const mockPosts: FeedPost[] = [
    mockPost,
    { ...mockPost, content: 'first post' },
    { ...mockPost, content: 'second post' },
  ];

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  const mockUpdateResult: UpdateResult = {
    ...mockDeleteResult,
    generatedMaps: [],
  };

  const mockPostService = {
    createPost: jest.fn().mockImplementation((user: User, feedPost: FeedPost) => {
      return {
        id: 1,
        ...feedPost,
      }
    }),
    findPosts: jest.fn().mockImplementation((numberToTake: number, numberToSkip: number) => {
      const postAfterSkipping = mockPosts.slice(numberToSkip);
      return postAfterSkipping.slice(0, numberToTake);
    }),
    update: jest.fn().mockImplementation(() => {
      return mockUpdateResult;
    }),
    delete: jest.fn().mockImplementation(() => {
    return mockDeleteResult;
  }),
  };

  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: IsCreatorGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: RolesGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
        .overrideProvider(PostService)
        .useValue(mockPostService)
        .compile();

    postService = module.get<PostService>(PostService);
    userService = module.get<UserService>(UserService);
    postController = module.get<PostController>(PostController);
  });

  it('PostController should be defined', () => {
    expect(postController).toBeDefined();
  });

  it('Should create a post', () => {
    expect(postController.create(mockPost, mockRequest)).toEqual({
      id: expect.any(Number),
      ...mockPost,
    });
  });

  it('Should get 2 posts skipping the first', () => {
    expect(postController.findPosts(2, 1)).toEqual(mockPosts.slice(1));
  });

  it('Should update a post', () => {
    expect(postController.update(1, {  ...mockPost, content: 'updated post' })).toEqual(mockUpdateResult);
  });

  it('Should delete a post', () => {
    expect(postController.delete(1)).toEqual(mockDeleteResult);
  });

});
