import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

declare var $: any;

@Component({
  selector: 'er-simple-header',
  templateUrl: './simple-header.component.html',
  styleUrls: ['./simple-header.component.scss']
})
export class SimpleHeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToHome() {
    console.log('goToHome');
    this.goToWelcomePage();
  }

  goToWelcomePage() {
    $('.button-collapse').sideNav('hide');
    this.router.navigate(['welcome']);
  }
}
