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
  esAdmin = signal(false);
  veAutorizaciones = signal(false);
  soloAutorizador = signal(false);

    constructor() {
    afterNextRender(() => {
      this.veSolicitudes.set(this.auth.tieneRol('ADMIN', 'EVALUADOR'));
      this.veMisSolicitudes.set(this.auth.tieneRol('ESTUDIANTE'));
      this.esAdmin.set(this.auth.esAdmin());
      this.veAutorizaciones.set(this.auth.tieneRol('ADMIN', 'EVALUADOR', 'AUTORIZADOR'));

      const solo =
        this.auth.tieneRol('AUTORIZADOR') &&
        !this.auth.tieneRol('ADMIN', 'EVALUADOR', 'ESTUDIANTE');
      this.soloAutorizador.set(solo);
      if (solo && ['/', '/tipos-becas'].includes(this.router.url)) {
        this.router.navigate(['/autorizaciones']);
      }
    });
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}