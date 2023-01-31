import { Component, Input } from '@angular/core';
import { BoxService } from 'src/app/services/box-service/box.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
  @Input() public boxId!: Number;
  @Input() public boxState!: String; //default value
  // backgroundColorStateBox: any;
  // subscription!: Subscription;
  constructor(public boxService: BoxService) {}

  ngOnInit(): any {
    let counter = 1;
    /** To maintain the state of the UI after disconnections
     *  Check if the data is stored in localStorage
     */
    const dataView = localStorage.getItem('dataView');
    if (dataView) {
      this.boxService.dataView = JSON.parse(dataView);
    }
    /**Initiating DB if empty*/
    this.boxService.initializeDBdata().subscribe((response: any) => {
      response.forEach((element: any) => {
        this.boxService.data.set(element.index, element);
      });
    });
    /**Initiating UI*/
    this.boxService.fetchData(counter);
    // interval - every 0.5 seconds update UI // ideal to be with Web Socket instead, I know
    this.boxService.subscription = interval(500).subscribe(() => {
      if (counter === 5) {
        this.boxService.subscription.unsubscribe();
      }
      // retrieve data from the API and update the UI
      this.boxService.fetchData(counter);
      // console.log(counter);
      // console.log(this.data);
      // counter++;
    });
    this.boxService.fetchData(counter).subscribe((response: any) => {
      response.forEach((element: any) => {
        // console.log(element);

        this.boxService.data.set(element.index, element);
      });

      this.boxService.dataView = [...this.boxService.data.values()];
      console.log(this.boxService.dataView);

      this.boxService.dataView.sort((a, b) => {
        return a.index - b.index;
      });

      // Store the data in localStorage
      localStorage.setItem(
        'dataView',
        JSON.stringify(this.boxService.dataView)
      );
    });
    this.boxService.dataView = [...this.boxService.data.values()];
    console.log(this.boxService.dataView);

    this.boxService.dataView.sort((a, b) => {
      return a.index - b.index;
    });

    // Store the data in localStorage
    localStorage.setItem('dataView', JSON.stringify(this.boxService.dataView));
  }

  // Prevent memory leak
  ngOnDestroy() {
    this.boxService.subscription.unsubscribe();
  }
}
