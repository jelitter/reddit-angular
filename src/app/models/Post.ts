export default interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  subreddit: string;
  permalink: string;
  creation: number;
  visible: boolean;
  maximized: boolean;
  image: {
    url: string;
    width: number;
    height: number;
  };
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  votes: {
    ups: number;
    downs: number;
  };
}
