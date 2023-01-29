import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  constructor(private http: HttpClient) {}

  //Http Client get method
  public getBoxState(id: Number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      }),
    };
    const url = `http://localhost:3000/api/state?id=${id}`;
    return this.http.get<any>(url, httpOptions);
  }
}
