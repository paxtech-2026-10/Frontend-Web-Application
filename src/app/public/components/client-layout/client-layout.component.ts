import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ToolbarClientComponent} from '../toolbar-client/toolbar-client.component';

@Component({
  selector: 'app-client-layout',
  imports: [
    RouterOutlet,
    ToolbarClientComponent
  ],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css'
})
export class ClientLayoutComponent {

}
