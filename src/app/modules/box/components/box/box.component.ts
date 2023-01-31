import { Component, Input } from '@angular/core';
import { BoxService } from 'src/app/services/box-service/box.service';
import { interval, Observable, Subscription, switchMap, take, timer } from 'rxjs';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
  @Input() public boxId!: Number;
  @Input() public boxState: String = "ERROR"; //default value
  // backgroundColorStateBox: any;
  subscription$!: Subscription;
  constructor(public boxService: BoxService) {}

  ngOnInit(): any {

      // this.subscription$ = interval(500)
      // .pipe(take(26.8)).pipe(switchMap(() => this.boxService.getBoxState(this.boxId)))
      // .subscribe((res) => {
      //     this.backgroundColorStateBox = res.state;
      //     this.boxService.updateCounter();
      //     console.log(this.boxService.getCounter() + " counter num");
      // })
  }

  // Prevent memory leak
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
