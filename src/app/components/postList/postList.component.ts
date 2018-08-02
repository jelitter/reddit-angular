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
  private interval;
  private timer;
  autoUpdate: boolean;

  constructor(private dataService: DataService) {
    this.title = "Reddit: Angular 2+ ";

    // Creating 25 empty posts to display while fetching
    this.autoUpdate = false;
    this.emptyPosts();
  }

  emptyPosts() {
    this.posts = [];
    for (let i = 0; i < 25; i++) {
      this.posts.push({
        id: "",
        title: "...",
        body: "",
        author: "",
        subreddit: "",
        permalink: "",
        comments: 0,
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
  getPost(posts): Post {
    const {
      id,
      title,
      selftext: body,
      author,
      subreddit,
      permalink,
      num_comments: comments,
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
      maximized: true,
      id,
      title,
      body,
      author,
      subreddit,
      permalink: `http://www.reddit.com${permalink}`,
      comments,
      votes,
      creation,
      thumbnail,
      image
    };
  }

  getPosts = () => {
    this.elapsed = 0;
    this.dataService.getPosts().subscribe(posts => {
      let unsortedPosts = posts.data.children.map(x => this.getPost(x.data));
      // New posts will be shown first
      this.posts = unsortedPosts.sort((a, b) => b.creation - a.creation);
      this.lastUpdated = new Date().getTime();
      console.log("Last updated", this.lastUpdated);
      console.log(this.posts);
    });
  };

  hide(id) {
    this.posts.find(post => post.id === id).visible = false;
  }

  toggleMaximized(id) {
    this.posts.find(post => post.id === id).maximized = !this.posts.find(
      post => post.id === id
    ).maximized;
  }

  toggleAutoUpdate = () => {
    this.autoUpdate = !this.autoUpdate;
    if (this.autoUpdate) {
      this.interval = setInterval(this.getPosts, 60000);
    } else {
      clearInterval(this.interval);
    }
  };

  voteUp(id) {
    this.posts.find(post => post.id === id).votes.ups++;
  }

  voteDown(id) {
    this.posts.find(post => post.id === id).votes.downs++;
  }

  updateTime = () => {
    this.elapsed = Math.floor((new Date().getTime() - this.lastUpdated) / 1000);
  };

  ngOnInit() {
    this.getPosts();
    this.timer = setInterval(this.updateTime, 1000);
  }
}
