import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'er-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  navigateAdminHome() {
    console.log("navigateAdminHome")
    this.router.navigate(['/admin']);
  }

  navigateToSignup() {
    console.log("navigateToSignup")
    this.router.navigate(['admin/signup']);
  }

  navigateToCoachSelector() {
    console.log("navigateToCoachSelector")
    this.router.navigate(['admin/coach-selector']);
  }

}
