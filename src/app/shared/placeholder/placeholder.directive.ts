import { Directive, ViewContainerRef } from "@angular/core";


// this directive injects the view container reference for the error message alert
@Directive({
    selector: '[appPlaceholder]'
})
export class PlaceholderDirective {

    constructor(public viewContainerRef: ViewContainerRef) {}
}