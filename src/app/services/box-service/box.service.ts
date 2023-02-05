import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  constructor(private http: HttpClient , private socket: Socket) {}

  counter$ = new BehaviorSubject<number>(0);
  data: Map<String, any> = new Map<String, any>();
  dataView: Array<any> = [];
  subscription!: Subscription;
  public isInitialCheckNeeded: boolean = true;

  getCounter(): Number {
    return this.counter$.value;
  }
  updateCounter(): void {
    this.counter$.next(this.counter$.value + 1);
  }
  //Http Client get method
  getBoxState(index: Number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      }),
    };
    const url = `http://localhost:3000/api/state?index=${index}`;
    return this.http.get<any>(url, httpOptions);
  }



/**If DB is empty then fill the documents up to 45 */
  initializeDBdata():Observable<any>{
    return this.http.get('http://localhost:3000/api/initializeData');
  }

  getColor(state: string) {
    switch (state) {
      case 'KWS_KERIDOS':
        return 'lightblue';
      case 'KWS_KERIDOS_YG':
        return 'orange';
      case 'UNKNOWN':
        return 'yellow';
      case 'ERROR':
        return 'grey';
      default:
        return 'lightgray';
    }
  }
}
