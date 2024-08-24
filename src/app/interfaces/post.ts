export default interface IPost {
  id: number;
  title: string;
  content: string;
  image: File;
  liked: boolean;
  createdAt: Date
  updatedAt: Date;
  deletedAt: Date;
}