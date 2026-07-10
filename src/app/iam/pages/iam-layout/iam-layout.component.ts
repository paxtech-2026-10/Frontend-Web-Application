import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgForOf } from '@angular/common';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { tsParticles, type ISourceOptions } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-iam-layout',
  standalone: true,
  imports: [RouterModule, NgForOf, LanguageSwitcherComponent, TranslatePipe],
  templateUrl: './iam-layout.component.html',
  styleUrl: './iam-layout.component.css',
  animations: [
    // Solo transiciona el panel derecho (formulario). La izquierda queda fija.
    trigger('routeFade', [
      transition('* <=> *', [
        // Superponer entrante y saliente para que no se apilen (sin salto de layout)
        query(':enter, :leave', [
          style({ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' })
        ], { optional: true }),
        query(':enter', [style({ opacity: 0, transform: 'translateY(12px)' })], { optional: true }),
        group([
          query(':leave', [
            animate('130ms ease', style({ opacity: 0, transform: 'translateY(-8px)' }))
          ], { optional: true }),
          query(':enter', [
            animate('260ms 90ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ], { optional: true }),
        ]),
      ]),
    ]),
  ],
})
export class IamLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  slideImages: string[] = [
    'https://www.gammabross.com/Gallery/salonimg-frkqkj-181.webp',
    'https://thehappening.com/wp-content/uploads/2024/02/captura-de-pantalla-2023-05-17-a-la-s-52813-pm-1.jpg',
    'https://cdn1.treatwell.net/images/view/v2.i7379851.w720.h480.x5F15B4CB/'
  ];
  activeIndex = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.slideImages.length;
    }, 5000);
  }

  async ngAfterViewInit() {
    await loadFull(tsParticles);
    await tsParticles.load({ id: 'particles-js', options: this.particlesOptions });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  setSlide(index: number): void {
    this.activeIndex = index;
  }

  // Devuelve un identificador por ruta para disparar la animación al navegar login<->register
  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.isActivated ? (outlet.activatedRouteData?.['animation'] ?? '') : '';
  }

  private particlesOptions: ISourceOptions = {
    // Sin pantalla completa: el canvas se queda dentro de #particles-js (panel
    // derecho) en lugar de cubrir toda la ventana y tapar la imagen de la izquierda.
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    particles: {
      number: { value: 80, density: { enable: true, width: 800 } },
      color: { value: '#f3a3ff' },
      shape: { type: 'circle' },
      opacity: { value: 0.5 },
      size: { value: { min: 2, max: 4 } },
      move: { enable: true, speed: 2, direction: 'none', outModes: { default: 'out' } },
      links: { enable: false },
    },
    detectRetina: true,
  };
}
