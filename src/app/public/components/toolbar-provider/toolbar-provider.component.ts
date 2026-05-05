  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterModule } from '@angular/router';
  import {RouterLink} from '@angular/router';
  import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
  import {FormsModule} from '@angular/forms';

  @Component({
    selector: 'app-toolbar-provider',
    imports: [RouterModule, CommonModule, RouterLink, LanguageSwitcherComponent, FormsModule],
    templateUrl: './toolbar-provider.component.html',
    styleUrl: './toolbar-provider.component.css'
  })
  export class ToolbarProviderComponent {


  }
