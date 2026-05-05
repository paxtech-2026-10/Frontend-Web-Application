import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {NgForOf, NgSwitch, NgSwitchCase} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import{MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-language-switcher',
  imports: [
    MatButtonToggleModule,
    NgForOf,
    NgSwitch,
    NgSwitchCase,
    MatMenu,
    MatIcon,
    MatMenuItem,
    MatButton,
    MatMenuTrigger
  ],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css',


})

export class LanguageSwitcherComponent {
  currentLang = 'en';
  languages = [
    { label: 'en', flag: 'assets/images/USA-Flag.png' },
    { label: 'es', flag: 'assets/images/Spanish-Flag.png' }
  ];

  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang;
  }

  useLanguage(language: string) {
    this.currentLang = language;
    this.translate.use(language);
  }

  getLanguage(){
    return this.languages.find(lang=> lang.label == this.currentLang);
  }

}
