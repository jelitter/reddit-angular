import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';


@Injectable()
export class DataService {

  reddit:string = 'https://www.reddit.com/r/angular2.json';

  constructor(public http:Http) { 
    console.log('Data service connected');
  }

  getPosts() {
    return this.http.get(this.reddit)
    .pipe(map((response: any) => response.json()));
  }
}
