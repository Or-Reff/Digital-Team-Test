import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { interval, switchMap, map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Digital-Team-Test';
  ids: Array<Number> = Array.from(Array(45).keys()); // creates 45 length array
  data : any = [];


  constructor(private http:HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    // Get data from the server every 0.5 seconds
    interval(500)
      .pipe(
        switchMap(() =>
          this.http.get('http://localhost:3000/api/data').pipe(
            map((data: any) => {
              // Map data to desired format
              return data.map((item: { id: any; state: string; }) => ({
                id: item.id,
                state: item.state,
                color: this.getColor(item.state)
              }));
            }),
            catchError(error => of(error))
          )
        )
      )
      .subscribe(data => {
        // Update data in the component
        this.data = data;
      });
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
