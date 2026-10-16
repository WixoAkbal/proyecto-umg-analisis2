import { Component, afterNextRender, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './layout.html',
})
export class Layout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  veSolicitudes = signal(false);
  veMisSolicitudes = signal(false);

  constructor() {
    afterNextRender(() => {
      this.veSolicitudes.set(this.auth.tieneRol('ADMIN', 'EVALUADOR'));
      this.veMisSolicitudes.set(this.auth.tieneRol('ESTUDIANTE'));
    });
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}