export default interface Post {
  id?: string;
  title?: string;
  body?: string;
  author?: string;
  subreddit?: string;
  link?: string;
  permalink?: string;
  creation?: number;
  visible?: boolean;
  maximized?: boolean;
  comments?: number;
  image?: {
    url?: string;
    width?: number;
    height?: number;
  };
  thumbnail?: {
    url?: string;
    width?: number;
    height?: number;
  };
  votes?: {
    ups?: number;
    downs?: number;
  };
}
