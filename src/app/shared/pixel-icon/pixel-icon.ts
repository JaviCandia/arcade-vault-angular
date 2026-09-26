import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type PixelIconKind = 'GAMEPAD' | 'FREE' | 'TROPHY' | 'ROCKET' | 'HEART' | 'BROWSER' | 'PLANT';

/** Decorative 16x16 pixel icons; colour comes from `currentColor`. */
@Component({
  selector: 'app-pixel-icon',
  templateUrl: './pixel-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixelIcon {
  readonly kind = input.required<PixelIconKind>();
  /** Global class that sizes the svg: `ft-icon` (features) or `hl-icon` (highlights). */
  readonly iconClass = input('ft-icon');
}
