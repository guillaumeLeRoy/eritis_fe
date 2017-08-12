import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef
} from "@angular/core";
import {LoaderSpinnerComponent} from "../loader/loader-spinner/loader-spinner.component";

@Directive({selector: '[ifLoader]'})
export class IfDirective {
  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private cfResolver: ComponentFactoryResolver) {
  }


  loaderComponentRef: ComponentRef<LoaderSpinnerComponent>;
  embeddedViewRef: EmbeddedViewRef<any>

  @Input() set ifLoader(loading: boolean) {
    if (loading) {
      console.log('CHILD: ', this.viewContainer.element.nativeElement);


      // create and attach a loader to our viewContainer
      const factory = this.cfResolver.resolveComponentFactory(LoaderSpinnerComponent);
      this.loaderComponentRef = this.viewContainer.createComponent(factory);

      // remove any embedded view
      if (this.embeddedViewRef) {
        this.embeddedViewRef.destroy();
        this.embeddedViewRef = null;
      }
    } else {

      // remove any loader
      if (this.loaderComponentRef) {
        this.loaderComponentRef.destroy();
        this.loaderComponentRef = null;
      }

      // create and attach our embeddedView
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}
