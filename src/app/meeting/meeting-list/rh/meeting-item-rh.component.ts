import {AfterViewInit, Component, Input, OnInit} from "@angular/core";
import {Coachee} from "../../../model/Coachee";
import {PotentialCoachee} from "../../../model/PotentialCoachee";
import {CoachCoacheeService} from "../../../service/CoachCoacheeService";
import {AuthService} from "../../../service/auth.service";
import {ApiUser} from "../../../model/apiUser";
import {Rh} from "../../../model/Rh";
import {CoacheeObjective} from "../../../model/CoacheeObjective";


declare var $: any;

@Component({
  selector: 'rb-meeting-item-rh',
  templateUrl: './meeting-item-rh.component.html',
  styleUrls: ['./meeting-item-rh.component.css']
})
export class MeetingItemRhComponent implements OnInit, AfterViewInit {

  @Input()
  coachee: Coachee;

  @Input()
  potentialCoachee: PotentialCoachee;

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  private loading: boolean;

  /**
   * Used in Objective modal.
   */
  private coacheeNewObjective: string;

  // private coacheeUsageRate: Observable<RhUsageRate>;

  constructor(private authService: AuthService, private coachCoacheeService: CoachCoacheeService) {
  }

  ngOnInit(): void {
    console.log('ngOnInit');

    // if (this.coachee) {
    //   this.getUsageRate(this.coachee.id);
    // }
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    // this.fetchConnectedUser();
  }

  printDateString(date: string) {
    return this.getDate(date);
  }

  getHours(date: string) {
    return (new Date(date)).getHours();
  }

  getMinutes(date: string) {
    let m = (new Date(date)).getMinutes();
    if (m === 0)
      return '00';
    return m;
  }

  getDate(date: string): string {
    return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
  }

  updateCoacheeObjectivePanelVisibility(visible: boolean) {
    if (visible) {
      $('#add_potential_coachee_modal').openModal();
    } else {
      $('#add_potential_coachee_modal').closeModal();
    }
  }

  cancelAddNewObjectiveModal() {
    this.updateCoacheeObjectivePanelVisibility(false);
  }

  validateAddNewObjectiveModal() {
    console.log('validateAddNewObjectiveModal');

    // TODO start loader
    let user = this.authService.getConnectedUser();
    if (user == null) {
      let userObs = this.authService.getConnectedUserObservable();
      userObs.take(1).subscribe(
        (user: ApiUser) => {
          console.log('validateAddNewObjectiveModal, got connected user');
          if (user instanceof Rh) {
            this.makeAPICallToAddNewObjective(user);
          }
        }
      );
      return;
    }

    if (user instanceof Rh) {
      this.makeAPICallToAddNewObjective(user);
    }

  }

  private makeAPICallToAddNewObjective(user: ApiUser) {
    this.updateCoacheeObjectivePanelVisibility(false);
    //call API
    this.coachCoacheeService.addObjectiveToCoachee(user.id, this.coachee.id, this.coacheeNewObjective).subscribe(
      (obj: CoacheeObjective) => {
        console.log('addObjectiveToCoachee, SUCCESS', obj);
        // close modal
        this.updateCoacheeObjectivePanelVisibility(false);
        // TODO stop loader

        // clean
        this.coacheeNewObjective = null;
      }
    );
  }

  // private getUsageRate(rhId: string) {
  //   this.coachCoacheeService.getUsageRate(rhId).subscribe(
  //     (rate: RhUsageRate) => {
  //       console.log("getUsageRate, rate : ", rate);
  //       this.coacheeUsageRate = Observable.of(rate);
  //     }
  //   );
  // }

}
