import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { interval, switchMap, map, catchError, of, Subscription } from 'rxjs';
// import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Digital-Team-Test';
  data: Map<String, any> = new Map<String, any>();
  dataView: Array<any> = [];
  subscription!: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    /** Check if the data is stored in localStorage
     *  To maintain the state of the UI after disconnections
     */
    // const data = localStorage.getItem('data');
    // if (data) {
    //   this.data = JSON.parse(data);
    // }
    let counter = 1; // interval - every 0.5 seconds update UI
    /**Initiating */
    this.fetchData(counter);

    this.subscription = interval(500).subscribe(() => {
      if (counter === 15) {
        this.subscription.unsubscribe();
      }
      // retrieve data from the API and update the UI
      this.fetchData(counter);
      console.log(counter);
      console.log(this.data);
      counter++;
    });
  }
  /**Fetching data to the UI*/
  fetchData(counter: Number) {
    let shouldFetchAll;
    if (counter === 1) {
      shouldFetchAll = true;
    } else {
      shouldFetchAll = false;
    }
    // retrieve data from the API and update the UI
    this.http
      .get('http://localhost:3000/api/data', {
        params: {
          shouldFetchAll: shouldFetchAll,
        },
      })
      .subscribe((response: any) => {
        response.forEach((element: any) => {
          this.data.set(element.id, element);
        });

        this.dataView = [...this.data.values()];
        console.log(this.dataView);

        this.dataView.sort((a, b) => {
          return a.id - b.id;
        });
       


        // Store the data in localStorage
        localStorage.setItem('data', JSON.stringify(this.data));
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
