import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { DataService } from "./services/data/data.service";
import { AppComponent } from "./app.component";
import { PostComponent } from "./components/post/post.component";
import { PostListComponent } from "./components/postList/postList.component";

@NgModule({
  declarations: [AppComponent, PostComponent, PostListComponent],
  imports: [BrowserModule, HttpModule, FormsModule],
  providers: [DataService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
