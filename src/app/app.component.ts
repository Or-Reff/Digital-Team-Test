import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data: Map<String, any> = new Map<String, any>();
  dataView: Array<any> = [];
  subscription!: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    /** To maintain the state of the UI after disconnections
     *  Check if the data is stored in localStorage
     */
    const dataView = localStorage.getItem('dataView');
    if (dataView) {
      this.dataView = JSON.parse(dataView);
    }
    let counter = 1;
    /**Initiating DB if empty*/
    this.http
      .get('http://localhost:3000/api/initializeData')
      .subscribe((response: any) => {
        response.forEach((element: any) => {
          this.data.set(element.index, element);
        });
      });
    /**Initiating UI*/
    this.fetchData(counter);
    // interval - every 0.5 seconds update UI // ideal to be with Web Socket instead, I know
    this.subscription = interval(500).subscribe(() => {
      if (counter === 500) {
        this.subscription.unsubscribe();
      }
      // retrieve data from the API and update the UI
      this.fetchData(counter);
      // console.log(counter);
      // console.log(this.data);
      // counter++;
    });
  }
  /**Fetching data to the UI*/
  fetchData(counter: Number) {
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
    this.http
      .get('http://localhost:3000/api/fetchData', {
        params: {
          shouldFetchAll: shouldFetchAll,
        },
      })
      .subscribe((response: any) => {
        response.forEach((element: any) => {
          this.data.set(element.index, element);
        });

        this.dataView = [...this.data.values()];
        console.log(this.dataView);

        this.dataView.sort((a, b) => {
          return a.index - b.index;
        });

        // Store the data in localStorage
        localStorage.setItem('dataView', JSON.stringify(this.dataView));
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
