import { Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {LoginFormComponent} from '../../components/login-form/login-form.component';
import { RouterModule } from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import { tsParticles, type ISourceOptions} from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import {LanguageSwitcherComponent} from '../../../public/components/language-switcher/language-switcher.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-login-page',
  imports: [
    LoginFormComponent,
    RouterModule,
    NgForOf,
    LanguageSwitcherComponent,
    TranslatePipe,
    NgIf,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy, AfterViewInit   {
  slideImages: string[] = [
    'https://www.gammabross.com/Gallery/salonimg-frkqkj-181.webp',
    'https://thehappening.com/wp-content/uploads/2024/02/captura-de-pantalla-2023-05-17-a-la-s-52813-pm-1.jpg',
    'https://cdn1.treatwell.net/images/view/v2.i7379851.w720.h480.x5F15B4CB/'
  ];

  activeIndex: number = 0;
  intervalId: any;

  isProvider: boolean = false;  // controla qué formulario mostrar

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.slideImages.length;
    }, 5000); // cambia cada 5 segundos
  }

  async ngAfterViewInit() {
    await loadFull(tsParticles);
    await tsParticles.load({
      id: 'particles-js',
      options: this.particlesOptions
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  setSlide(index: number): void {
    this.activeIndex = index;
  }

  toggleForm(value: boolean) {
    this.isProvider = value;
  }

  private particlesOptions: ISourceOptions = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    particles: {
      number: { value: 80, density: { enable: true, width: 800 } },
      color: { value: '#f3a3ff' },
      shape: { type: 'circle' },
      opacity: { value: 0.5 },
      size: {
        value: { min: 2, max: 4 },
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        outModes: { default: 'out' }
      },
      links: {
        enable: false
      }
    },
    detectRetina: true
  };

}
