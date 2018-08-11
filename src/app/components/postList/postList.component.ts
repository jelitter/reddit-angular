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

    const thumbnail = {
      url: thumbUrl.match(/default|self/) ? '' : thumbUrl,
      width: thumbWidth,
      height: thumbHeight
    };
    const votes = { ups, downs };

    return {
      visible: true,
      maximized: true,
      id,
      title: cleanMarkdown(title),
      body: cleanMarkdown(body),
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

const cleanHtmlEntities = str =>
  str
    .toString()
    .replace('&amp;', '&')
    .replace('&lt;', '<')
    .replace('&quot;', '"');

const cleanMarkdown = src => {
  var h = '',
    i = 0;
  function inlineEscape(s) {
    return cleanHtmlEntities(s)
      .replace(/!\[([^\]]*)]\(([^(]+)\)/g, '<img alt="$1" src="$2">')
      .replace(/\[([^\]]+)]\(([^(]+)\)/g, '$1'.link('$2'))
      .replace(/([^"])(https?:\/\/([^\s"]+))/g, '$1$3'.link('$1$2'))
      .replace(/^(https?:\/\/([^\s"]+))/g, '$2'.link('$1'))
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }
  src
    .replace(/\r|\s+$/g, '')
    .replace(/\t/g, '    ')
    .split(/\n\n+/)
    .forEach(function(b, f, R) {
      f = b.substr(0, 2);
      R = {
        '* ': [/\n\* /, '<ul><li>', '</li></ul>'],
        '- ': [/\n- /, '<ul><li>', '</li></ul>'],
        '  ': [/\n    /, '<pre><code>', '</code></pre>', '\n'],
        '> ': [/\n> /, '<blockquote>', '</blockquote>', '\n']
      }[f];
      if (b.match(/\n[1-9]\d*\. /))
        R = [/\n[1-9]\d*\. /, '<ol><li>', '</li></ol>'];
      if (b.match(/\n[1-9]\d*\) /))
        R = [/\n[1-9]\d*\) /, '<ol><li>', '</li></ol>'];
      f = b[0];
      if (R)
        h +=
          R[1] +
          ('\n' + b)
            .split(R[0])
            .slice(1)
            .map(R[3] ? cleanHtmlEntities : inlineEscape)
            .join(R[3] || '</li>\n<li>') +
          R[2];
      else if (f == '#')
        h +=
          '<h' +
          Math.min(6, (f = b.indexOf(' '))) +
          '>' +
          inlineEscape(b.slice(f + 1)) +
          '</h' +
          Math.min(6, f) +
          '>';
      else {
        h += '<p>' + inlineEscape(b) + '</p>';
        i++;
      }
    });
  if (i == 1) return inlineEscape(src);
  return h;
};
