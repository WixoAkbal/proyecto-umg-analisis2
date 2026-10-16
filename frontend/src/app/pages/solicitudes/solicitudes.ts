import { Component, afterNextRender, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from '@openng/optimus-ui/table';
import { Solicitud, SolicitudesService } from './solicitudes.service';
import { EstadoSolicitud, EstadosSolicitudesService } from './estados-solicitudes.service';

@Component({
  selector: 'app-solicitudes',
  imports: [FormsModule, TableModule],
  templateUrl: './solicitudes.html',
})
export class Solicitudes {
  private readonly service = inject(SolicitudesService);
  private readonly estadosService = inject(EstadosSolicitudesService);

  solicitudes = signal<Solicitud[]>([]);
  estados = signal<EstadoSolicitud[]>([]);
  cargando = signal(false);
  error = signal('');

  constructor() {
    afterNextRender(() => {
      this.cargar();
      this.estadosService.listar().subscribe({ next: (datos) => this.estados.set(datos) });
    });
  }

  cargar(): void {
    this.cargando.set(true);

    this.service.listar().subscribe({
      next: (datos) => {
        this.solicitudes.set(datos);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(
          err.status === 403
            ? 'No tienes permiso para ver las solicitudes'
            : 'No se pudieron cargar las solicitudes',
        );
      },
    });
  }

  cambiarEstado(solicitud: Solicitud, estadoId: number): void {
    if (estadoId === solicitud.estadoSolicitud?.id) return;

    this.error.set('');
    this.service.cambiarEstado(solicitud.id, estadoId).subscribe({
      next: () => this.cargar(),
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.status === 403
            ? 'No tienes permiso para cambiar el estado'
            : 'No se pudo cambiar el estado',
        );
        this.cargar();
      },
    });
  }

  nombrePersona(solicitud: Solicitud): string {
    const p = solicitud.persona;
    return p ? `${p.primerNombre ?? ''} ${p.primerApellido ?? ''}`.trim() : '—';
  }

  etiqueta(nombre: string): string {
    return nombre.replace(/_/g, ' ');
  }
}