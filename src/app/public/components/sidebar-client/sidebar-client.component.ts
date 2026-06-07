import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-client',
  imports: [
    RouterLink,
    RouterModule,
    RouterLinkActive,
    TranslatePipe
  ],
  templateUrl: './sidebar-client.component.html',
  styleUrl: './sidebar-client.component.css'
})
export class SidebarClientComponent {

}
