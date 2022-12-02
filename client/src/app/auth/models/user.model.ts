export type Role = 'user' | 'admin' | 'premium';
export type Post = {
  id: number;
  content: string;
  author: User;
  created_at: Date;
  updated_at: Date;
}

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
