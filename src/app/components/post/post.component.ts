import { Component, Input } from "@angular/core";
import Post from "../../models/Post";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"]
})
export class PostComponent {
  @Input() post: Post;

  hide = () => (this.post.visible = false);
  toggleMaximized = () => (this.post.maximized = !this.post.maximized);
  voteUp = () => this.post.votes.ups++;
  voteDown = () => this.post.votes.downs++;
}
