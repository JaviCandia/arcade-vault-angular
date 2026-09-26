import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, input, OnInit, output, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScorePipe } from '../../../shared/score.pipe';

@Component({
  selector: 'app-game-over-dialog',
  imports: [ReactiveFormsModule, RouterLink, ScorePipe],
  templateUrl: './game-over-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOverDialog implements OnInit {
  readonly score = input.required<number>();
  readonly initialName = input.required<string>();
  readonly save = output<string>();
  readonly restart = output<void>();

  protected readonly saved = signal(false);
  protected readonly name = new FormControl('', { nonNullable: true });
  private readonly firstControl = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  constructor() {
    afterNextRender(() => this.firstControl()?.nativeElement.focus());
  }

  ngOnInit(): void {
    this.name.setValue(this.initialName());
  }

  protected onNameInput(): void {
    this.name.setValue(this.name.value.toUpperCase().slice(0, 10), { emitEvent: false });
  }

  protected submit(): void {
    this.save.emit(this.name.value);
    this.saved.set(true);
  }
}
