import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Decorative pixel silhouettes of classic arcade shapes. */
@Component({
  selector: 'app-floating-silhouettes',
  templateUrl: './floating-silhouettes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingSilhouettes {}
