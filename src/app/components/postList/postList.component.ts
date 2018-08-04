import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import Post from '../../models/Post';

@Component({
  selector: 'app-post-list',
  templateUrl: './postList.component.html',
  styleUrls: ['./postList.component.css']
})
export class PostListComponent implements OnInit {
  private AUTO_UPDATE_INTERVAL: number = 60000;
  private postsBackup: Post[]; // Holds a copy of the fetched posts so it can be restored when filtering
  private lastUpdated: number;
  private elapsed: number; // seconds since last fetch
  private interval; // auto fetch posts
  private timer; // update timer in page header
  private autoUpdate: boolean;
  title: string;
  posts: Post[];
  fetching: boolean;
  filterText: string; // ngModel from input field

  constructor(private dataService: DataService) {
    this.title = 'Reddit: Angular 2+ ';
    this.fetching = true;
    this.autoUpdate = false;
    this.emptyPosts(); // Creating 25 empty posts to display while fetching
  }

  emptyPosts = () => {
    this.posts = new Array<Post>(25);
    const emptyPost: Post = { title: '...', body: '...', visible: true };
    this.posts.fill(emptyPost, 0, 25);
  };

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
      url: link,
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

    const url = preview ? preview.images[0].source.url : '';
    const width = preview ? preview.images[0].source.width : '';
    const height = preview ? preview.images[0].source.height : '';
    const image = { url, width, height };

    const thumbnail = { url: thumbUrl, width: thumbWidth, height: thumbHeight };
    const votes = { ups, downs };

    return {
      visible: true,
      maximized: true,
      id,
      title: cleanHtmlEntities(title),
      body: cleanHtmlEntities(body),
      author,
      subreddit,
      link,
      permalink: `http://www.reddit.com${permalink}`,
      comments,
      votes,
      creation,
      thumbnail,
      image
    };
  }

  getPosts = () => {
    this.fetching = true;
    this.elapsed = 0;
    this.lastUpdated = new Date().getTime();
    this.dataService.getPosts().subscribe(posts => {
      const unsortedPosts = posts.data.children.map(x => this.getPost(x.data));
      // Sorting by creation date, decending. New posts will be shown first
      this.posts = unsortedPosts.sort((a, b) => b.creation - a.creation);
      this.postsBackup = [...this.posts];
      this.fetching = false;
    });
  };

  toggleAutoUpdate = () => {
    this.autoUpdate = !this.autoUpdate;
    if (this.autoUpdate) {
      this.getPosts();
      this.interval = setInterval(this.getPosts, this.AUTO_UPDATE_INTERVAL);
    } else {
      clearInterval(this.interval);
    }
  };

  textEntered = () => {
    this.posts = this.postsBackup.filter(
      p =>
        p.title.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) !=
          -1 ||
        p.body.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) != -1
    );
  };

  updateTime = () => {
    this.elapsed = Math.floor((new Date().getTime() - this.lastUpdated) / 1000);
  };

  ngOnInit() {
    this.getPosts();
    this.timer = setInterval(this.updateTime, 1000);
  }
}

// Helper function to cleanup HTML entities from posts
const cleanHtmlEntities = str =>
  String(str)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
