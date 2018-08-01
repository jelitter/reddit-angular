import { Component, OnInit } from '@angular/core';
import { DataService} from '../../services/data/data.service'

@Component({
  selector: 'app-post-list',
  templateUrl: './postList.component.html',
  styleUrls: ['./postList.component.css']
})
export class PostListComponent implements OnInit {
  
  title:string;
  posts:Post[];

  constructor(private dataService:DataService) {
  }

  ngOnInit() {
    this.title = 'Post List Title';
    this.dataService.getPosts().subscribe((posts) => {

      const newPosts = posts.data.children.map(x => 
        const { title, 
                author, 
                subreddit, 
                created_utc : creation,
                thumbnail : url,
                thumbnail_width : width,
                thumbnail_height : height
        } = x.data;

        const img = { url, width, height }
        return { title, author, subreddit, creation, img };
      );

      this.posts = newPosts;

      console.log(JSON.stringify(newPosts,null,2));

    })
  }
}


interface Post {
  title: string,
  author: string,
  subreddit: string,
  creation: number, // created_utc
  img: {
    url: string,      // thumbnail  
    width: number,    // thumbnail_width
    height:  number   // thumbnail_height
  }         
}