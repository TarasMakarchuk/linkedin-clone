import { User } from "../../auth/models/user.model";

export interface Post {
  id: number;
  content: string;
  author: User;
  created_at: Date;
  updated_at: Date;
}
