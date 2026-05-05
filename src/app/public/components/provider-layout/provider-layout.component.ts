import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {ToolbarProviderComponent} from "../toolbar-provider/toolbar-provider.component";

@Component({
  selector: 'app-provider-layout',
    imports: [
        RouterOutlet,
        SidebarComponent,
        ToolbarProviderComponent
    ],
  templateUrl: './provider-layout.component.html',
  styleUrl: './provider-layout.component.css'
})
export class ProviderLayoutComponent {

}
