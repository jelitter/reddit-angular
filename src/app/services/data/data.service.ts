import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";

@Injectable()
export class DataService {
  redditURL: string;

  constructor(public http: Http) {
    this.redditURL = "https://www.reddit.com/r/angular2.json";
  }

  getPosts() {
    return this.http
      .get(this.redditURL)
      .pipe(map((response: any) => response.json()));
  }
}
