import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TableModule } from '@openng/optimus-ui/table';
import { Notificacion, NotificacionesService } from './notificaciones.service';

@Component({
  selector: 'app-notificaciones',
  imports: [DatePipe, ButtonModule, TableModule],
  templateUrl: './notificaciones.html',
})
export class Notificaciones {
  private readonly service = inject(NotificacionesService);

  notificaciones = signal<Notificacion[]>([]);
  cargando = signal(false);
  error = signal('');

  sinLeer = computed(() => this.notificaciones().filter((n) => !n.leida).length);

  constructor() {
    afterNextRender(() => this.cargar());
  }

  cargar(): void {
    this.error.set('');
    this.cargando.set(true);

    this.service.listar().subscribe({
      next: (datos) => {
        this.notificaciones.set([...datos].sort((a, b) => b.id - a.id));
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudieron cargar las notificaciones');
      },
    });
  }

  marcarLeida(n: Notificacion): void {
    this.error.set('');

    this.service.marcarLeida(n.id).subscribe({
      next: () => this.cargar(),
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.status === 403
            ? 'No puedes marcar esa notificacion'
            : 'No se pudo marcar como leída',
        );
      },
    });
  }
}