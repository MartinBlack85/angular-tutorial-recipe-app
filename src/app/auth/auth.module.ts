import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

import { AuthComponent } from "./auth.component";

// Commonmodule is needed if *ngIf or *ngFor is used in any of the related components
// path needs to be empty here, pathname is in app-routing due to lasy-loading settings
@NgModule({
    declarations: [AuthComponent],
    imports: [
        CommonModule, 
        FormsModule, 
        RouterModule.forChild([{ path: '', component: AuthComponent }]),
        SharedModule
    ]
})
export class AuthModule {

}