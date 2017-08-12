import {ComponentFactoryResolver, Directive, Input, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
import {LoaderSpinnerComponent} from "../loader/loader-spinner/loader-spinner.component";

declare var $: any;

@Directive({ selector: '[ifLoader]' })
export class IfDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private cfResolver: ComponentFactoryResolver,
    private renderer: Renderer2
  ) { }

  @Input() set ifLoader(loading: boolean) {
    if (loading) {
      // If condition is true add template to DOM
      // this.viewContainer.clear();
      // $('loader-spinner').show();
      if ($('loader-spinner').length === 0) {
        console.log('CHILD: ', this.viewContainer.element.nativeElement);
        const factory = this.cfResolver.resolveComponentFactory(LoaderSpinnerComponent);
        const componentRef = this.viewContainer.createComponent(factory);

        this.renderer.appendChild(
          this.viewContainer.element.nativeElement,
          componentRef.injector.get(LoaderSpinnerComponent).elRef.nativeElement
        );
      }
    } else {
      // Else remove template from DOM
      $('loader-spinner').hide();
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}
