import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { PostListComponent } from "./components/postList/postList.component";

import { DataService } from "./services/data/data.service";

@NgModule({
  declarations: [AppComponent, PostListComponent],
  imports: [BrowserModule, HttpModule, FormsModule],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
