import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'er-code-deontologie',
  templateUrl: './code-deontologie.component.html',
  styleUrls: ['./code-deontologie.component.scss']
})
export class CodeDeontologieComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  goToCoachRegister() {
    this.router.navigate(['/register_coach/step1']);
  }
}
