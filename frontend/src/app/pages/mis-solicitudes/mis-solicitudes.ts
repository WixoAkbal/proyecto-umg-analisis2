import { Component, afterNextRender, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { TableModule } from '@openng/optimus-ui/table';
import { Solicitud, SolicitudesService } from '../solicitudes/solicitudes.service';
import { Convocatoria, ConvocatoriasService } from '../convocatorias/convocatorias.service';
import { DocumentosDialogo } from '../documentos/documentos-dialogo';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [FormsModule, ButtonModule, DialogModule, TableModule, DocumentosDialogo],
  templateUrl: './mis-solicitudes.html',
})
export class MisSolicitudes {
  private readonly service = inject(SolicitudesService);
  private readonly convocatoriasService = inject(ConvocatoriasService);

  solicitudes = signal<Solicitud[]>([]);
  convocatoriasActivas = signal<Convocatoria[]>([]);
  cargando = signal(false);
  error = signal('');

  dialogoVisible = signal(false);
  enviando = signal(false);
  errorForm = signal('');
  convocatoriaId: number | null = null;

  confirmarVisible = signal(false);
  cancelando = signal(false);
  errorCancelar = signal('');
  solicitudACancelar: Solicitud | null = null;

  documentosVisible = signal(false);
  solicitudDocumentos = signal<Solicitud | null>(null);

  constructor() {
    afterNextRender(() => {
      this.cargar();
      this.convocatoriasService.listar().subscribe({
        next: (datos) =>
          this.convocatoriasActivas.set(
            datos.filter((c) => c.estadoConvocatoria?.nombre?.toLowerCase() === 'activa'),
          ),
      });
    });
  }

  cargar(): void {
    this.error.set('');
    this.cargando.set(true);

    this.service.mias().subscribe({
      next: (datos) => {
        this.solicitudes.set(datos);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(this.mensaje(err, 'No se pudieron cargar tus solicitudes'));
      },
    });
  }

  puedeCancelar(s: Solicitud): boolean {
    const estado = s.estadoSolicitud?.id;
    return estado === 1 || estado === 2;
  }

  etiqueta(nombre: string | undefined): string {
    return nombre ? nombre.replace(/_/g, ' ') : '—';
  }

  verDocumentos(s: Solicitud): void {
    this.solicitudDocumentos.set(s);
    this.documentosVisible.set(true);
  }

  puedeModificarDocumentos(): boolean {
    const s = this.solicitudDocumentos();
    return s !== null && this.puedeCancelar(s);
  }

  abrirNueva(): void {
    this.convocatoriaId = null;
    this.errorForm.set('');
    this.dialogoVisible.set(true);
  }

  enviar(): void {
    if (this.convocatoriaId === null) {
      this.errorForm.set('Selecciona una convocatoria');
      return;
    }

    this.errorForm.set('');
    this.enviando.set(true);

    this.service.crearPropia(this.convocatoriaId).subscribe({
      next: () => {
        this.enviando.set(false);
        this.dialogoVisible.set(false);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.enviando.set(false);
        this.errorForm.set(this.mensaje(err, 'No se pudo crear la solicitud'));
      },
    });
  }

  pedirCancelar(s: Solicitud): void {
    this.solicitudACancelar = s;
    this.errorCancelar.set('');
    this.confirmarVisible.set(true);
  }

  confirmarCancelar(): void {
    if (!this.solicitudACancelar) return;

    this.errorCancelar.set('');
    this.cancelando.set(true);

    this.service.cancelar(this.solicitudACancelar.id).subscribe({
      next: () => {
        this.cancelando.set(false);
        this.confirmarVisible.set(false);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.cancelando.set(false);
        this.errorCancelar.set(this.mensaje(err, 'No se pudo cancelar la solicitud'));
      },
    });
  }

  private mensaje(err: HttpErrorResponse, porDefecto: string): string {
    const m = err.error?.message;
    if (err.status >= 400 && err.status < 500) {
      if (Array.isArray(m)) return m.join('. ');
      if (typeof m === 'string') return m;
    }
    return porDefecto;
  }
}