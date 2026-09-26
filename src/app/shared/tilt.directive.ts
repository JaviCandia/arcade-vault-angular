import { Directive, ElementRef, inject } from '@angular/core';

/** 3D hover tilt for cards. Disabled with prefers-reduced-motion. */
@Directive({
  selector: '[appTilt]',
  host: {
    '(mousemove)': 'onMove($event)',
    '(mouseleave)': 'reset()',
  },
})
export class TiltDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected onMove(e: MouseEvent): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = this.el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    this.el.style.transform = `translateY(-6px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg)`;
  }

  protected reset(): void {
    this.el.style.transform = '';
  }
}
