import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription, switchMap, take } from 'rxjs';
import { BoxService } from './services/box-service/box.service';
import { DataView } from '../interfaces/data-view';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data: Map<String, DataView> = new Map<String, DataView>();
  dataView: Array<DataView> = [];
  subscription!: Subscription;

  constructor(private http: HttpClient, public boxService: BoxService , private socket: Socket) {}

  ngOnInit() {
    // Initialize UI
    let counter = 1;
    this.socket.emit('firstUiInitializeServer');
    this.socket.on('firstUiInitializeClient' , (arrOfDocs:any)=>{
      console.log('client');

      arrOfDocs.forEach((element: any) => {
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
    })
    this.socket.on('fetchData', (data:any) => {
    // socket.io - every 0.5 seconds update UI //
    data.forEach((element: any) => {
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


    if (this.boxService.isInitialCheckNeeded) {
      this.boxService.initializeDBdata().subscribe((response: any) => {
        if (response.message !== 'Already initialized data') {
          response.forEach((element: any) => {
            this.boxService.data.set(element.index, element);
          });
        }
        this.boxService.isInitialCheckNeeded = false;
      });
    }
  }

  // fetchData(){
  //   this.socket.emit('fetchData');
  // }

  // Prevent memory leak
  ngOnDestroy() {
    this.boxService.subscription.unsubscribe();
  }
}
