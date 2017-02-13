import { Directive, HostBinding, HostListener } from '@angular/core';
import { LogService } from './service/log.service';


@Directive({
  selector: '[rbDropdown]',
  providers: [LogService]
})
export class DropdownDirective {

  constructor(private logService: LogService) {

  }

  @HostBinding('class.open') get opened() {
    return this.isOpen
  }

  @HostListener('click') open() { 
    this.isOpen = true;
  }

  @HostListener('mouseleave') close() {
    this.isOpen = false;
    this.logService.writeToLog("mouse leave")
  }

  private isOpen = false

}
