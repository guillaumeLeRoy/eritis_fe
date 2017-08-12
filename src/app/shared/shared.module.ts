import { IfDirective } from './if.directive';
import {NgModule} from "@angular/core";
import {LoaderSpinnerComponent} from "../loader/loader-spinner/loader-spinner.component";

@NgModule({
  declarations: [
    IfDirective
  ],
  exports: [
    IfDirective
  ],
  entryComponents: [
    LoaderSpinnerComponent
  ]
})
export class SharedModule {}
