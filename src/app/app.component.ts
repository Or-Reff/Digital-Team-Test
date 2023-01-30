import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { interval, switchMap, map, catchError, of, Subscription } from 'rxjs';
// import { Socket } from 'socket.io';
import { Socket } from "ngx-socket-io";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Digital-Team-Test';
  ids: Array<Number> = Array.from(Array(45).keys()); // creates 45 length array
  data: any = [];
  subscription!: Subscription;

  constructor(private http: HttpClient, private socket: Socket) {}

  ngOnInit() {
    /**Initiating */
    this.fetchData();
    let counter = 0;    // interval - every 0.5 seconds update UI
    this.subscription = interval(500).subscribe(() => {
      if (counter === 3) { //TODO change to 500 times
        this.subscription.unsubscribe();
      }
      // retrieve data from the API and update the UI
      this.fetchData();
      console.log(counter);
      console.log(this.data);
      counter++;
    });

     // Listen to the 'data' event from the socket
     this.subscription = this.socket.fromEvent('data').subscribe((data: any) => {
      this.data = data.map((item: any, index: any) => ({
        id: index,
        state: item.state,
      }));
    });
  }
  /**Fetching data to the UI*/
  fetchData(){
    // retrieve data from the API and update the UI
    this.http.get('http://localhost:3000/api/data').subscribe((response: any) => {
      this.data = response.map((item: any, index: any) => ({
        id: index,
        state: item.state,
      }));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  // ngOnInit() {
  //   this.fetchData();
  // }

  // fetchData() {
  //   // Get data from the server every 0.5 seconds
  //   interval(500)
  //     .pipe(
  //       switchMap(() =>
  //         this.http.get('http://localhost:3000/api/data').pipe(
  //           map((data: any) => {
  //             // Map data to desired format
  //             return data.map((item: { id: Number; state: string; }) => ({
  //               id: item.id,
  //               state: item.state,
  //               color: this.getColor(item.state)
  //             }));
  //           }),
  //           catchError(error => of(error))
  //         )
  //       )
  //     )
  //     .subscribe(data => {
  //       // Update data in the component
  //       this.data = data;
  //     });
  // }

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
