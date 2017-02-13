import { Injectable, EventEmitter } from '@angular/core';
import { LogService } from './log.service';

@Injectable()
export class DataService {

  private data: string[] = []

  pushedData = new EventEmitter<string>();


  constructor(private logService: LogService) {

  }

  addData(input: string) {
    this.data.push(input)
    this.logService.writeToLog("add new data")
    this.pushedData.emit(input)

  }

  getData() {
    return this.data
  }

}
