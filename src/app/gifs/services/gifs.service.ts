import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY: string = 'WTIjpY6RMowh73kE2bfAd3T9cwGcbx3P';
const SERVICE_URL: string = 'https://api.giphy.com/v1/gifs/search';

@Injectable({providedIn: 'root'})
export class GifsService {

  private _tagsHistory: string[] = [];
  public gifList: Gif[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag:string) {

    tag = tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag)=>oldTag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory.splice(10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if(this._tagsHistory.length>0) {
      this.searchTag(this._tagsHistory[0]);
    }
  }

  searchTag(tag: string): void {
    if(tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key',GIPHY_API_KEY)
      .set('limit',12)
      .set('rating','r')
      .set('q',tag);

    this.http.get<SearchResponse>(SERVICE_URL,{params})
    .subscribe(resp => {
      this.gifList = resp.data;
    })

  }

  removeTag(tag:string):void {
    this._tagsHistory = this._tagsHistory.filter((t) => t !== tag);
    this.saveLocalStorage();
    this.loadLocalStorage();
  }
}
