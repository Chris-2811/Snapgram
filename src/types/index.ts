import { Timestamp } from "firebase/firestore";

export interface IPost {
  caption: string;
  createdAt: string | Timestamp;
  location: string;
  photoUrls: string[];
  shares?: number;
  tags: string[];
  userId: string;
}
