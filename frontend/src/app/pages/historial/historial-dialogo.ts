import { Component, effect, inject, input, model, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { HistorialEstado, HistorialService } from './historial.service';

@Component({
  selector: 'app-historial-dialogo',
  imports: [DatePipe, ButtonModule, DialogModule],
  template: `
    <p-dialog
      [header]="'Historial de la solicitud #' + (solicitudId() ?? '')"
      [modal]="true"
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [style]="{ width: '36rem' }"
    >
      <div class="flex flex-col gap-4">
        @if (cargando()) {
          <p>Cargando...</p>
        } @else if (error()) {
          <small class="text-red-500">{{ error() }}</small>
        } @else if (registros().length === 0) {
          <p>Esta solicitud todavía no tiene cambios de estado.</p>
        } @else {
          <ol class="flex flex-col gap-3 border-l-2 border-gray-200 pl-4">
            @for (r of registros(); track r.id) {
              <li>
                <div class="font-semibold">
                  {{ etiqueta(r.estadoAnteriorSolicitud?.nombre) }} → {{ etiqueta(r.estadoNuevoSolicitud?.nombre) }}
                </div>
                <div class="text-sm text-gray-600">
                  Por {{ r.usuario?.nombre }} {{ r.usuario?.apellido }} ·
                  {{ r.fechaHoraCreado | date: 'dd/MM/yyyy HH:mm' }}
                </div>
                @if (r.comentario) {
                  <div class="text-sm text-gray-500">{{ r.comentario }}</div>
                }
              </li>
            }
          </ol>
        }
        <div class="flex justify-end">
          <p-button label="Cerrar" severity="secondary" (onClick)="visible.set(false)" />
        </div>
      </div>
    </p-dialog>
  `,
})
export class HistorialDialogo {
  private readonly service = inject(HistorialService);

  visible = model(false);
  solicitudId = input<number | null>(null);

  registros = signal<HistorialEstado[]>([]);
  cargando = signal(false);
  error = signal('');

  constructor() {
    effect(() => {
      const id = this.solicitudId();
      if (this.visible() && id !== null) {
        this.cargar(id);
      }
    });
  }

  etiqueta(nombre?: string | null): string {
    return nombre ? nombre.replace(/_/g, ' ') : 'Inicio';
  }

  private cargar(id: number): void {
    this.error.set('');
    this.cargando.set(true);
    this.service.listarPorSolicitud(id).subscribe({
      next: (datos) => {
        this.registros.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudo cargar el historial');
      },
    });
  }
}