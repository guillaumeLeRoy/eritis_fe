import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Admin} from "../model/Admin";
import {AdminAPIService} from "../service/adminAPI.service";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'er-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  private admin: BehaviorSubject<Admin>;

  constructor(private router: Router, private adminHttpService: AdminAPIService) {
    this.admin = new BehaviorSubject(null);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getAdmin();
  }

  getAdmin() {
    if (environment.production) {
      this.adminHttpService.getAdmin().subscribe(
        (admin: Admin) => {
          console.log('getAdmin, obtained', admin);
          this.admin.next(admin);
        },
        error => {
          console.log('getAdmin, error obtained', error);
        }
      );
    }
  }

  isOnProfile() {
    let admin = new RegExp('/profile');
    return admin.test(this.router.url);
  }

  navigateAdminHome() {
    console.log("navigateAdminHome")
    this.router.navigate(['/admin']);
  }

  navigateToSignup() {
    console.log("navigateToSignup")
    this.router.navigate(['admin/signup']);
  }


}
