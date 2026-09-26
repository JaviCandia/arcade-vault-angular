import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PixelIcon, PixelIconKind } from '../../shared/pixel-icon/pixel-icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { ContactForm } from './contact-form/contact-form';

interface Highlight {
  icon: PixelIconKind;
  text: string;
  color: 'magenta' | 'cyan' | 'green';
}

@Component({
  selector: 'app-about',
  imports: [PixelIcon, RevealDirective, ContactForm],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {
  protected readonly highlights: readonly Highlight[] = [
    { icon: 'HEART', text: 'HECHO CON ❤️ PARA JUGADORES', color: 'magenta' },
    { icon: 'BROWSER', text: 'JUEGOS EN HTML — CORREN EN CUALQUIER NAVEGADOR', color: 'cyan' },
    { icon: 'PLANT', text: 'PROYECTO EN CONSTANTE CRECIMIENTO', color: 'green' },
  ];
  protected readonly pixels = Array.from({ length: 24 }, (_, i) => i);
}
