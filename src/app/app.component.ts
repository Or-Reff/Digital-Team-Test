import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { BoxService } from './services/box-service/box.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data: Map<String, any> = new Map<String, any>();
  dataView: Array<any> = [];
  subscription!: Subscription;

  constructor(private http: HttpClient, public boxService: BoxService) {}

  ngOnInit() {
    if (this.boxService.isInitialCheckNeeded) {
      this.boxService.initializeDBdata().subscribe((response: any) => {
        console.log("response1");
        console.log(response);
        response.forEach((element: any) => {
          this.boxService.data.set(element.index, element);
        });
        this.boxService.isInitialCheckNeeded = false;
      });
    }
    /**Initiating UI*/
    this.boxService.fetchData();
    // interval - every 0.5 seconds update UI // ideal to be with Web Socket instead, I know
    this.boxService.subscription = interval(500).subscribe(() => {
      if (this.boxService.getCounter() === 10) {
        this.boxService.subscription.unsubscribe();
      }
      // retrieve data from the API and update the UI
      this.boxService.fetchData();
      // console.log(counter);
      // console.log(this.data);
    });
    this.boxService.fetchData().subscribe((response: any) => {
      console.log("response2");
      console.log(response);

      response.forEach((element: any) => {
        // console.log(element);

        this.boxService.data.set(element.index, element);
      });

      this.boxService.dataView = [...this.boxService.data.values()];
      // console.log(this.boxService.dataView);

      this.boxService.dataView.sort((a, b) => {
        return a.index - b.index;
      });

      // Store the data in localStorage
      localStorage.setItem(
        'dataView',
        JSON.stringify(this.boxService.dataView)
      );
    });
  }

  // Prevent memory leak
  ngOnDestroy() {
    this.boxService.subscription.unsubscribe();
  }


}
