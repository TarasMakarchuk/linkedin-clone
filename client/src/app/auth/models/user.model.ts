export type Role = 'user' | 'admin' | 'premium';
export type Post = {
  id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  author: User;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  posts: [];
  createdAt: Date;
  updatedAt: Date;
}
