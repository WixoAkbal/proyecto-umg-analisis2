import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TableModule } from '@openng/optimus-ui/table';
import { AuthService } from '../../core/auth.service';
import { Autorizacion, AutorizacionesService, SolicitudResumen } from './autorizaciones.service';


const LIMITE_SEGUNDA_APROBACION = 10000;

@Component({
  selector: 'app-autorizaciones',
  imports: [FormsModule, CurrencyPipe, DatePipe, ButtonModule, DialogModule, InputTextModule, TableModule],
  templateUrl: './autorizaciones.html',
})
export class Autorizaciones {
  private readonly service = inject(AutorizacionesService);
  private readonly auth = inject(AuthService);

  autorizaciones = signal<Autorizacion[]>([]);
  solicitudes = signal<SolicitudResumen[]>([]);
  cargando = signal(false);
  error = signal('');

  puedeAutorizar = signal(false);
  puedeConfirmar = signal(false);

  dialogoVisible = signal(false);
  guardando = signal(false);
  errorForm = signal('');
  solicitudId: number | null = null;
  monto: number | null = null;
  comentario = '';

  confirmarVisible = signal(false);
  confirmando = signal(false);
  errorConfirmar = signal('');
  aConfirmar: Autorizacion | null = null;

  eliminarVisible = signal(false);
  eliminando = signal(false);
  errorEliminar = signal('');
  aEliminar: Autorizacion | null = null;

  disponibles = computed(() => {
    const yaAutorizadas = new Set(this.autorizaciones().map((a) => a.solicitud?.id));
    return this.solicitudes().filter((s) => !yaAutorizadas.has(s.id));
  });

  constructor() {
    afterNextRender(() => {
      this.puedeAutorizar.set(this.auth.tieneRol('ADMIN'));
      this.puedeConfirmar.set(this.auth.tieneRol('AUTORIZADOR'));
      this.cargar();
      if (this.puedeAutorizar()) {
        this.service.listarSolicitudes().subscribe({ next: (d) => this.solicitudes.set(d) });
      }
    });
  }

  get superaLimite(): boolean {
    return this.monto !== null && this.monto > LIMITE_SEGUNDA_APROBACION;
  }

  etiqueta(s: SolicitudResumen): string {
    const nombre = `${s.persona?.primerNombre ?? ''} ${s.persona?.primerApellido ?? ''}`.trim();
    return `#${s.id} - ${s.convocatoria?.nombre ?? 'Sin convocatoria'} - ${nombre || 'Sin nombre'}`;
  }

  cargar(): void {
    this.error.set('');
    this.cargando.set(true);

    this.service.listar().subscribe({
      next: (datos) => {
        this.autorizaciones.set(datos);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(
          err.status === 403
            ? 'No tienes permiso para ver las autorizaciones'
            : 'No se pudieron cargar las autorizaciones',
        );
      },
    });
  }

  nueva(): void {
    this.solicitudId = null;
    this.monto = null;
    this.comentario = '';
    this.errorForm.set('');
    this.dialogoVisible.set(true);
  }

  guardar(): void {
    if (this.solicitudId === null) {
      this.errorForm.set('Selecciona una solicitud');
      return;
    }
    if (this.monto === null || this.monto <= 0) {
      this.errorForm.set('El monto debe ser mayor que cero');
      return;
    }

    this.errorForm.set('');
    this.guardando.set(true);

    this.service
      .crear({
        solicitudId: this.solicitudId,
        monto: this.monto,
        comentario: this.comentario.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.dialogoVisible.set(false);
          this.cargar();
        },
        error: (err: HttpErrorResponse) => {
          this.guardando.set(false);
          this.errorForm.set(
            err.status === 409
              ? 'Esa solicitud ya tiene una autorización'
              : err.status === 400
                ? 'Revisa los datos: el monto admite hasta 2 decimales'
                : err.status === 403
                  ? 'No tienes permiso para autorizar'
                  : 'No se pudo guardar la autorización',
          );
        },
      });
  }

  pedirConfirmar(a: Autorizacion): void {
    this.aConfirmar = a;
    this.errorConfirmar.set('');
    this.confirmarVisible.set(true);
  }

  confirmar(): void {
    if (!this.aConfirmar) return;

    this.errorConfirmar.set('');
    this.confirmando.set(true);

    this.service.confirmar(this.aConfirmar.id).subscribe({
      next: () => {
        this.confirmando.set(false);
        this.confirmarVisible.set(false);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.confirmando.set(false);
        this.errorConfirmar.set(
          err.status === 403
            ? 'No puedes confirmar: la segunda aprobación la debe hacer otra persona con rol AUTORIZADOR'
            : 'No se pudo confirmar la autorización',
        );
      },
    });
  }

  pedirEliminar(a: Autorizacion): void {
    this.aEliminar = a;
    this.errorEliminar.set('');
    this.eliminarVisible.set(true);
  }

  eliminar(): void {
    if (!this.aEliminar) return;

    this.errorEliminar.set('');
    this.eliminando.set(true);

    this.service.eliminar(this.aEliminar.id).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.eliminarVisible.set(false);
        this.cargar();
        this.service.listarSolicitudes().subscribe({ next: (d) => this.solicitudes.set(d) });
      },
      error: (err: HttpErrorResponse) => {
        this.eliminando.set(false);
        this.errorEliminar.set(
          err.status === 403 ? 'No tienes permiso para eliminar' : 'No se pudo eliminar',
        );
      },
    });
  }
}