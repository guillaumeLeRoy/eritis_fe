import { Directive, ElementRef, Renderer, HostBinding, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[rbMyDirective]'
})
export class MyDirectiveDirective {

  @HostListener('mouseenter') mouseOver() {
    this.backgroundColor = this.highLightColor
  }

  @HostListener('mouseleave') mouseLeave() {
    this.backgroundColor = this.defaultColor
  }

  @HostBinding('style.backgroundColor') get setBgColor() {
    return this.backgroundColor;
  }

  @Input() defaultColor = 'white';
  @Input() highLightColor = 'green';
  private backgroundColor: string

  // constructor(elementRef : ElementRef, private renderer : Renderer) { 
  //    this.elementRef = elementRef
  //    //this.elementRef.nativeElement.style.backgroundColor = 'green';

  //    this.renderer.setElementStyle(this.elementRef.nativeElement,'background-color','red')
  // }

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.backgroundColor = this.defaultColor
  }

}
