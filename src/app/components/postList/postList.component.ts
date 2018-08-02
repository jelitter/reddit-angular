import { Component, OnInit } from "@angular/core";
import { DataService } from "../../services/data/data.service";
import Post from "../../models/Post";

@Component({
  selector: "app-post-list",
  templateUrl: "./postList.component.html",
  styleUrls: ["./postList.component.css"]
})
export class PostListComponent implements OnInit {
  title: string;
  posts: Post[];
  lastUpdated: number;
  elapsed: number;

  constructor(private dataService: DataService) {
    this.title = "Reddit: Angular 2+ ";

    // Creating 25 empty posts to display while fetching
    this.posts = [];
    for (let i = 0; i < 25; i++) {
      this.posts.push({
        id: i,
        title: "...",
        body: "",
        author: "",
        subreddit: "",
        permalink: "",
        creation: 0,
        visible: true,
        maximized: true,
        image: {
          url: "",
          width: 0,
          height: 0
        },
        thumbnail: {
          url: "",
          width: 0,
          height: 0
        },
        votes: {
          ups: 0,
          downs: 0
        }
      });
    }
  }

  /**
   * We extract only the fields we need for each post in JSON data
   */
  getPost(posts, index): Post {
    const {
      title,
      selftext: body,
      author,
      subreddit,
      permalink,
      ups,
      downs,
      preview,
      created_utc: creation,
      thumbnail: thumbUrl,
      thumbnail_width: thumbWidth,
      thumbnail_height: thumbHeight
    } = posts;

    const url = preview ? preview.images[0].source.url : "";
    const width = preview ? preview.images[0].source.width : "";
    const height = preview ? preview.images[0].source.height : "";
    const image = { url, width, height };

    const thumbnail = { url: thumbUrl, width: thumbWidth, height: thumbHeight };
    const votes = { ups, downs };

    return {
      visible: true,
      maximized: false,
      id: index,
      title,
      body,
      author,
      subreddit,
      // permalink : 'http://www.reddit.com' + permalink,
      permalink: `http://www.reddit.com${permalink}`,
      votes,
      creation,
      thumbnail,
      image
    };
  }

  getPosts() {
    this.dataService.getPosts().subscribe(posts => {
      this.posts = posts.data.children.map((x, index) => {
        this.lastUpdated = new Date().getTime();
        return this.getPost(x.data, index);
      });
      console.log("get posts");

      //console.log(JSON.stringify(this.posts, null, 2));
    });
  }

  hide(id) {
    this.posts[id].visible = false;
  }

  toggleMaximized(id) {
    this.posts[id].maximized = !this.posts[id].maximized;
  }

  voteUp(id) {
    this.posts[id].votes.ups++;
  }

  voteDown(id) {
    this.posts[id].votes.downs++;
  }

  updateTime = () => {
    this.elapsed = Math.floor((new Date().getTime() - this.lastUpdated) / 1000);
  };

  ngOnInit() {
    this.getPosts();
    setInterval(this.updateTime, 1000);
  }
}
