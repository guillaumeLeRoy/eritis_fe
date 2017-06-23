import {Component, OnInit, Input} from '@angular/core';
import {Message} from "./message";

@Component({
  selector: 'rb-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss']
})
export class ChatItemComponent implements OnInit {

  @Input() message: Message

  constructor() {
  }

  changeBackground() {
    if (this.message.photoUrl != null) {
      return {'background-image': 'url(' + this.message.photoUrl + ')'};
    } else {
      return null;
    }
  }

  ngOnInit() {
  }

}
