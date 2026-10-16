import { Component, afterNextRender, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TableModule } from '@openng/optimus-ui/table';
import { AuthService } from '../../core/auth.service';
import { Solicitud, SolicitudesService } from '../solicitudes/solicitudes.service';
import { Comite, ComitesService } from './comites.service';
import { Evaluacion, EvaluacionesService } from './evaluaciones.service';

@Component({
  selector: 'app-evaluaciones',
  imports: [FormsModule, ButtonModule, DialogModule, InputTextModule, TableModule],
  templateUrl: './evaluaciones.html',
})
export class Evaluaciones {
  private readonly service = inject(EvaluacionesService);
  private readonly solicitudesService = inject(SolicitudesService);
  private readonly comitesService = inject(ComitesService);
  private readonly auth = inject(AuthService);

  evaluaciones = signal<Evaluacion[]>([]);
  solicitudes = signal<Solicitud[]>([]);
  comites = signal<Comite[]>([]);
  cargando = signal(false);
  error = signal('');
  esAdmin = signal(false);

  dialogoVisible = signal(false);
  guardando = signal(false);
  errorForm = signal('');
  editandoId: number | null = null;
  solicitudId: number | null = null;
  comiteId: number | null = null;
  puntaje: number | null = null;
  observaciones = '';

  confirmarVisible = signal(false);
  eliminando = signal(false);
  errorEliminar = signal('');
  evaluacionAEliminar: Evaluacion | null = null;

  constructor() {
    afterNextRender(() => {
      this.esAdmin.set(this.auth.esAdmin());
      this.cargar();
      this.solicitudesService.listar().subscribe({ next: (datos) => this.solicitudes.set(datos) });
      this.comitesService.listar().subscribe({ next: (datos) => this.comites.set(datos) });
    });
  }

  cargar(): void {
    this.error.set('');
    this.cargando.set(true);

    this.service.listar().subscribe({
      next: (datos) => {
        this.evaluaciones.set(datos);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(
          err.status === 403
            ? 'No tienes permiso para ver las evaluaciones'
            : 'No se pudieron cargar las evaluaciones',
        );
      },
    });
  }

  descripcionSolicitud(id: number | undefined): string {
    if (id === undefined) return '—';
    const s = this.solicitudes().find((x) => x.id === id);
    if (!s) return `Solicitud ${id}`;
    const p = s.persona;
    const nombre = p ? `${p.primerNombre ?? ''} ${p.primerApellido ?? ''}`.trim() : '';
    return `#${s.id} · ${nombre || 'Sin nombre'} · ${s.convocatoria?.nombre ?? '—'}`;
  }

  nuevo(): void {
    this.editandoId = null;
    this.solicitudId = null;
    this.comiteId = null;
    this.puntaje = null;
    this.observaciones = '';
    this.errorForm.set('');
    this.dialogoVisible.set(true);
  }

  editar(e: Evaluacion): void {
    this.editandoId = e.id;
    this.solicitudId = e.solicitud?.id ?? null;
    this.comiteId = e.comite?.id ?? null;
    this.puntaje = Number(e.puntaje);
    this.observaciones = e.observaciones ?? '';
    this.errorForm.set('');
    this.dialogoVisible.set(true);
  }

  guardar(): void {
    if (this.solicitudId === null || this.comiteId === null) {
      this.errorForm.set('Selecciona la solicitud y el comité');
      return;
    }
    if (this.puntaje === null || Number.isNaN(this.puntaje)) {
      this.errorForm.set('El puntaje es obligatorio');
      return;
    }
    if (this.puntaje < 0 || this.puntaje > 999.99) {
      this.errorForm.set('El puntaje debe estar entre 0 y 999.99');
      return;
    }
    if (Math.abs(this.puntaje * 100 - Math.round(this.puntaje * 100)) > 1e-6) {
      this.errorForm.set('El puntaje admite como máximo dos decimales');
      return;
    }

    const datos = {
      solicitudId: this.solicitudId,
      comiteId: this.comiteId,
      puntaje: this.puntaje,
      observaciones: this.observaciones.trim(),
    };

    this.errorForm.set('');
    this.guardando.set(true);

    const peticion =
      this.editandoId === null
        ? this.service.crear(datos)
        : this.service.actualizar(this.editandoId, datos);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.dialogoVisible.set(false);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorForm.set(this.mensajeError(err));
      },
    });
  }

  pedirEliminar(e: Evaluacion): void {
    this.evaluacionAEliminar = e;
    this.errorEliminar.set('');
    this.confirmarVisible.set(true);
  }

  confirmarEliminar(): void {
    if (!this.evaluacionAEliminar) return;

    this.errorEliminar.set('');
    this.eliminando.set(true);

    this.service.eliminar(this.evaluacionAEliminar.id).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.confirmarVisible.set(false);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.eliminando.set(false);
        this.errorEliminar.set(
          err.status === 403 ? 'No tienes permiso para eliminar' : 'No se pudo eliminar',
        );
      },
    });
  }

  private mensajeError(err: HttpErrorResponse): string {
    if (err.status === 400) return 'Revisa los datos: el puntaje va de 0 a 999.99 con dos decimales como maximo';
    if (err.status === 403) return 'No tienes permiso para esta accion';
    return 'No se pudo guardar la evaluacion';
  }
}