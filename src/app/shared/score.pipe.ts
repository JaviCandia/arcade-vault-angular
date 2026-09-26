import { Pipe, PipeTransform } from '@angular/core';

const fmt = new Intl.NumberFormat('es-ES');

@Pipe({ name: 'score' })
export class ScorePipe implements PipeTransform {
  transform(value: number): string {
    return fmt.format(value);
  }
}
