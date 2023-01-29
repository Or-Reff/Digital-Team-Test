import { Component, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Digital-Team-Test';
  ids: Array<Number> = Array.from(Array(45).keys()); // creates 45 length array

  constructor() {}

  ngOnInit() {}
}
