import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { first, interval, Subscription, switchMap, take } from 'rxjs';
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
        console.log('response1');
        console.log(response);
        if (response.message !== 'Already initialized data') {
          response.forEach((element: any) => {
            this.boxService.data.set(element.index, element);
          });
        }
        this.boxService.isInitialCheckNeeded = false;
      });
    }
    /**Initiating UI*/
    // interval - every 0.5 seconds update UI // ideal to be with Web Socket instead, I know
    this.boxService.subscription = interval(500)
      .pipe(
        take(500),
        switchMap(() => this.boxService.fetchData())
      )
      .subscribe((response) => {
        // retrieve data from the API and update the UI
        response.forEach((element: any) => {
          this.boxService.data.set(element.index, element);
        });
        this.boxService.dataView = [...this.boxService.data.values()];
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
