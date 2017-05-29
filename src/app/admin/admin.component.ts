import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Admin} from "../model/Admin";
import {AdminAPIService} from "../service/adminAPI.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'er-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private admin: Observable<Admin>;

  constructor(private router: Router, private adminHttpService: AdminAPIService) {
  }

  ngOnInit() {
    this.getAdmin();
  }


  getAdmin() {
    this.adminHttpService.getAdmin().subscribe(
      (admin: Admin) => {
        this.admin = Observable.of(admin);
      },

      // (error: string) => {
      //   console.log("getAdmin error ", error)
      //
      // }

      error => {
        console.log('getAdmin, error obtained', error);

      }
    );
  }

  navigateAdminHome() {
    console.log("navigateAdminHome")
    this.router.navigate(['/admin']);
  }

  navigateToSignup() {
    console.log("navigateToSignup")
    this.router.navigate(['admin/signup']);
  }

  // navigateToCoachSelector() {
  //   console.log("navigateToCoachSelector")
  //   this.router.navigate(['admin/coach-selector']);
  // }

}
