import { Injectable } from '@angular/core';
import { BoxService } from '../box-service/box.service';
import { DocumentUpdate } from '../../../interfaces/documentUpdate.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(public boxService : BoxService) { }

    /**Fetching data to the UI*/
    fetchData(arr:Array<DocumentUpdate>):void {
      arr.forEach((element: DocumentUpdate) => {

        this.boxService.data.set(element.index.toString(), element);
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
        this.boxService.updateCounter();
      }


}
