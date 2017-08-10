import { IfDirective } from './if.directive';
import {NgModule} from "@angular/core";

@NgModule({
  declarations: [
    IfDirective
  ],
  exports: [
    IfDirective
  ]
})
export class SharedModule {}
