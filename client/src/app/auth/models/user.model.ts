import { Post } from '../../home/models/Post';

export type Role = 'user' | 'admin' | 'premium';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  posts: Post[];
  createdAt: Date;
  updatedAt: Date;
}
