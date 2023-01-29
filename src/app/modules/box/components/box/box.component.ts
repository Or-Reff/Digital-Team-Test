import { Component, Input } from '@angular/core';
import { BoxService } from 'src/app/services/box-service/box.service';
import { interval, Observable, Subscription, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
  @Input() public boxId!: Number;
  backgroundColorStateBox: any;
  subscription$!: Subscription;
  constructor(private boxService: BoxService) {}

  ngOnInit(): any {
    // this.boxService.getBoxState(this.boxId).subscribe(res =>{
    //   this.backgroundColorStateBox = res.state;
    // });

    this.subscription$ = interval(500)
      .pipe(switchMap(() => this.boxService.getBoxState(this.boxId)))
      .subscribe((res) => (this.backgroundColorStateBox = res.state));
  }

  // Prevent memory leak
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
