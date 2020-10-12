import {HttpClient} from '@angular/common/http';
import {Component,  AfterViewInit} from '@angular/core';
import {Observable, of as observableOf} from 'rxjs'; 

export interface NewsItem {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  checked = false;
  selected='';
  selectedType=4;
  selectedYear=2020; 
  
  teamsDatabase: TeamListDatabase | null;
  teamsData: TeamsList; 
  preData: TipsList;
  modelData: ModelList;

  gamesDatabase: GamesListDatabase | null;
  gamesData: GamesList;
  resData: GamesList;
 
  news: NewsItem[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  nowType = 'home';

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
 
  constructor(private _httpClient: HttpClient) {}; 
  ngAfterViewInit() {
    
    this.teamsDatabase = new TeamListDatabase(this._httpClient);
    this.teamsDatabase.getTeamsList().subscribe(teams=>this.teamsData = teams);
    this.teamsDatabase.getTeamsPredict(2020,1).subscribe(tips=>this.preData = tips);
    this.teamsDatabase.getModelsPredict().subscribe(models=>this.modelData = models);

    this.gamesDatabase = new GamesListDatabase(this._httpClient);
    this.gamesDatabase.getGamesList().subscribe(games=>this.gamesData = games);
    this.gamesDatabase.getResultList().subscribe(games=>this.resData = games);
     
  }
}

export interface ModelList{
  sources: OneModel[];
}

export interface OneModel{
  icon: string;
  id: number;
  name: string;
  url: string;
}

export interface TipsList{
  tips: OneTip[];
}

export interface OneTip{
  margin: string;
  tipteamid: number;
  sourceid: number; 
  err: number;
  updated: Date;
  source: string;
  round: number;
  ateamid: number;
  year: number;
  bits: string;
  correct: number;
  venue: string;
  hteam: string;
  confidence: string;
  date: Date;
  hconfidence: string;
  hteamid: number;
  ateam: string;
  tip: string;
  gameid: number;
}

export interface TeamsList{
  teams: OneTeam[];
}

export interface OneTeam{
  abbrev: string;
  name: string;
  id: number;
  logo: string;
}

export interface GamesList{
  games: OneGame[];
}

export interface OneGame{
  updated: Date;
  is_grand_final: boolean;
  year: number;
  winnerteamid: number;
  round: number;
  ateamid: number;
  tz: string;
  hscore: number;
  roundname: string;
  agoals: number;
  winner: string;
  date: Date;
  is_final: number;
  ateam: string;
  hteamid: number;
  ascore: number;
  venue: string;
  hteam: string;
  complete: string;
  abehinds: number;
  hbehinds: number;
  id: number;
  hgoals: number;
}

 
export class TeamListDatabase{
  constructor(private _httpClient: HttpClient){}

  getTeamsList(): Observable<TeamsList>{
    const teamRequestUrl = `https://api.squiggle.com.au/?q=teams`;
    //return this._httpClient.jsonp<TeamsList>(teamRequestUrl, 'callback');
    return this._httpClient.get<TeamsList>(teamRequestUrl);
  }

  getTeamsPredict(year: number, round: number):Observable<TipsList>{
    const preRequestUrl = `https://api.squiggle.com.au/?q=tips;year=`+year+`;round=`+round;
    return this._httpClient.get<TipsList>(preRequestUrl);
  }

  getModelsPredict():Observable<ModelList>{
    const modelRequestUrl = `https://api.squiggle.com.au/?q=sources`;
    return this._httpClient.get<ModelList>(modelRequestUrl);
  }
}

export class GamesListDatabase{
  constructor(private _httpClient: HttpClient){}
  getGamesList(): Observable<GamesList>{
    const gameRequestUrl = `https://api.squiggle.com.au/?q=games;year=2020;round=1`; 
    return this._httpClient.get<GamesList>(gameRequestUrl);
  }
  getResultList(): Observable<GamesList>{
    const resRequestUrl = `https://api.squiggle.com.au/?q=games`; 
    return this._httpClient.get<GamesList>(resRequestUrl);
  }
} 