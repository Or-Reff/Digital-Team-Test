import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  constructor(private http: HttpClient) {}

  counter = new BehaviorSubject<number>(0);
  // public counter$ = this.counter.asObservable();
  data: Map<String, any> = new Map<String, any>();
  dataView: Array<any> = [];
  subscription!: Subscription;

  getCounter(): Number {
    return this.counter.value;
  }
  updateCounter(): void {
    this.counter.next(this.counter.value + 1);
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

  /**Fetching data to the UI*/
  fetchData(counter: Number):Observable<any> {
    /**if it's the first time, fetch all 45 items
     * else fetch only the updated items
     */
    let shouldFetchAll;
    if (counter === 1) {
      shouldFetchAll = true;
    } else {
      shouldFetchAll = false;
    }
    // retrieve data from the API and update the UI
    return this.http
      .get('http://localhost:3000/api/fetchData', {
        params: {
          shouldFetchAll: shouldFetchAll,
        },
      })
      // .subscribe((response: any) => {
      //   response.forEach((element: any) => {
      //     this.data.set(element.index, element);
      //   });

      //   this.dataView = [...this.data.values()];
      //   console.log(this.dataView);

      //   this.dataView.sort((a, b) => {
      //     return a.index - b.index;
      //   });

      //   // Store the data in localStorage
      //   localStorage.setItem('dataView', JSON.stringify(this.dataView));
      // });
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
