import { Component, Input } from '@angular/core';
import { BoxService } from 'src/app/services/box-service/box.service';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
  @Input() public boxId!: Number;
  @Input() public boxState!: String; //default value
  constructor(public boxService: BoxService) {}

  ngOnInit(): any {

  }
}
