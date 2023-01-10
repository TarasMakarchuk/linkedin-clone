import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserService } from '../auth/services/user.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
const httpMocks = require('node-mocks-http');

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;
  let userService: UserService;

  const mockPostService = {};
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
});
