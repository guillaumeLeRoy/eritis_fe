import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

declare var $: any;

@Directive({ selector: '[ifLoader]' })
export class IfDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input() set ifLoader(loading: boolean) {
    if (loading) {
      // If condition is true add template to DOM
      // this.viewContainer.clear();
      $('loader-spinner').show();
    } else {
      // Else remove template from DOM
      $('loader-spinner').hide();
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}
