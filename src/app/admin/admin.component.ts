import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Admin} from "../model/Admin";
import {AdminAPIService} from "../service/adminAPI.service";
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";

@Component({
  selector: 'rb-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  private admin: Observable<Admin>;

  constructor(private router: Router, private adminHttpService: AdminAPIService, private cd: ChangeDetectorRef) {
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
          this.admin = Observable.of(admin);
          this.cd.detectChanges();
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
