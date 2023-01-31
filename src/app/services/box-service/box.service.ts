import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  constructor(private http: HttpClient) {}

  public counter = new BehaviorSubject<number>(0);
  // public counter$ = this.counter.asObservable();

  public getCounter(): Number {
    return this.counter.value;
  }
  public updateCounter(): void {
    this.counter.next(this.counter.value+1)
  }
  //Http Client get method
  public getBoxState(index: Number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      }),
    };
    const url = `http://localhost:3000/api/state?index=${index}`;
    return this.http.get<any>(url, httpOptions);
  }
}
