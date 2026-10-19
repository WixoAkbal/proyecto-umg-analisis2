import {
  Component,
  ElementRef,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { CatalogosService, ItemCatalogo } from '../catalogo/catalogos.service';
import { Documento, DocumentosService } from './documentos.service';

const TIPOS_PERMITIDOS = ['pdf', 'png', 'jpg', 'jpeg'];
const MAX_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-documentos-dialogo',
  imports: [DatePipe, FormsModule, ButtonModule, DialogModule],
  template: `
    <p-dialog
      header="Documentos de la solicitud"
      [modal]="true"
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [style]="{ width: '54rem' }"
    >
      <div class="flex flex-col gap-4">
        @if (error()) {
          <small class="text-red-500">{{ error() }}</small>
        }

        @if (cargando()) {
          <p>Cargando...</p>
        } @else if (documentos().length === 0) {
          <p>Esta solicitud todavía no tiene documentos.</p>
        } @else {
          <table class="w-full text-left">
            <thead>
              <tr>
                <th class="py-2">Tipo</th>
                <th>Archivo</th>
                <th>Subido</th>
                <th>Revisión</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (d of documentos(); track d.id) {
                <tr class="border-t border-gray-200">
                  <td class="py-2 pr-2">{{ etiqueta(d.tipoDocumento?.nombre) }}</td>
                  <td class="max-w-xs pr-2">
                    <button
                      type="button"
                      class="break-all text-left text-emerald-700 underline hover:text-emerald-900"
                      title="Abrir en una pestaña nueva"
                      (click)="verArchivo(d)"
                    >
                      {{ d.nombre }}
                    </button>
                  </td>
                  <td class="whitespace-nowrap pr-2">{{ d.fechaHoraCreado | date: 'dd/MM/yyyy HH:mm' }}</td>
                  <td class="pr-2">{{ d.comentarioRevision ?? '—' }}</td>
                  <td>
                    <div class="flex items-center gap-1">
                      <p-button
                        icon="pi pi-download"
                        [text]="true"
                        [rounded]="true"
                        (onClick)="descargar(d)"
                      />
                      @if (puedeModificar()) {
                        @if (confirmandoId() === d.id) {
                          <span class="text-sm">¿Eliminar?</span>
                          <p-button label="Sí" severity="danger" [text]="true" (onClick)="eliminar(d)" />
                          <p-button label="No" severity="secondary" [text]="true" (onClick)="cancelarEliminar()" />
                        } @else {
                          <p-button
                            icon="pi pi-trash"
                            severity="danger"
                            [text]="true"
                            [rounded]="true"
                            (onClick)="pedirEliminar(d)"
                          />
                        }
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }

        @if (puedeModificar()) {
          <div class="flex flex-col gap-2 border-t border-gray-200 pt-4">
            <label for="tipoDocumento">Tipo de documento</label>
            @if (tipos().length === 0) {
              <small class="text-red-500">
                No hay tipos de documento disponibles. Pide al administrador que los registre.
              </small>
            }
            <select
              id="tipoDocumento"
              [(ngModel)]="tipoDocumentoId"
              class="rounded-md border border-gray-300 p-2"
            >
              <option [ngValue]="null">Selecciona...</option>
              @for (t of tipos(); track t.id) {
                <option [ngValue]="t.id">{{ etiqueta(t.nombre) }}</option>
              }
            </select>
            <input
              #campoArchivo
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              (change)="seleccionar($event)"
            />
            <small class="text-gray-500">PDF, JPG o PNG, máximo 5 MB.</small>
            <div class="flex justify-end">
              <p-button
                label="Subir documento"
                icon="pi pi-upload"
                [loading]="subiendo()"
                (onClick)="subir()"
              />
            </div>
          </div>
        }

        <div class="flex justify-end">
          <p-button label="Cerrar" severity="secondary" (onClick)="visible.set(false)" />
        </div>
      </div>
    </p-dialog>
  `,
})
export class DocumentosDialogo {
  private readonly documentosService = inject(DocumentosService);
  private readonly catalogos = inject(CatalogosService);

  visible = model(false);
  solicitudId = input<number | null>(null);
  puedeModificar = input(false);

  documentos = signal<Documento[]>([]);
  tipos = signal<ItemCatalogo[]>([]);
  cargando = signal(false);
  subiendo = signal(false);
  error = signal('');
  confirmandoId = signal<number | null>(null);

  tipoDocumentoId: number | null = null;
  private archivo: File | null = null;
  private readonly campoArchivo = viewChild<ElementRef<HTMLInputElement>>('campoArchivo');

  constructor() {
    effect(() => {
      if (this.visible() && this.solicitudId() !== null) {
        untracked(() => this.prepararDialogo());
      }
    });
  }

  private prepararDialogo(): void {
    this.error.set('');
    this.confirmandoId.set(null);
    this.tipoDocumentoId = null;
    this.archivo = null;
    this.documentos.set([]);
    this.cargar();

    if (this.puedeModificar() && this.tipos().length === 0) {
      this.catalogos.listar('tipos-documentos').subscribe({
        next: (datos) => this.tipos.set(datos),
      });
    }
  }

  cargar(): void {
    const id = this.solicitudId();
    if (id === null) return;

    this.cargando.set(true);
    this.documentosService.listarPorSolicitud(id).subscribe({
      next: (datos) => {
        this.documentos.set(datos);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(
          err.status === 403
            ? 'No tienes acceso a los documentos de esta solicitud'
            : 'No se pudieron cargar los documentos',
        );
      },
    });
  }

  etiqueta(nombre: string | undefined): string {
    return nombre ? nombre.replace(/_/g, ' ') : '—';
  }

  seleccionar(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const elegido = campo.files?.[0] ?? null;
    this.error.set('');

    if (elegido) {
      const extension = elegido.name.split('.').pop()?.toLowerCase() ?? '';
      if (!TIPOS_PERMITIDOS.includes(extension)) {
        this.error.set('Solo se permiten archivos PDF, JPG o PNG');
        this.archivo = null;
        campo.value = '';
        return;
      }
      if (elegido.size > MAX_BYTES) {
        this.error.set('El archivo supera los 5 MB');
        this.archivo = null;
        campo.value = '';
        return;
      }
    }
    this.archivo = elegido;
  }

  subir(): void {
    const solicitudId = this.solicitudId();
    if (solicitudId === null) return;
    if (this.tipoDocumentoId === null) {
      this.error.set('Selecciona el tipo de documento');
      return;
    }
    if (!this.archivo) {
      this.error.set('Selecciona un archivo');
      return;
    }

    this.error.set('');
    this.subiendo.set(true);

    this.documentosService.subir(solicitudId, this.tipoDocumentoId, this.archivo).subscribe({
      next: () => {
        this.subiendo.set(false);
        this.archivo = null;
        this.tipoDocumentoId = null;
        const campo = this.campoArchivo();
        if (campo) campo.nativeElement.value = '';
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.subiendo.set(false);
        this.error.set(this.mensaje(err));
      },
    });
  }

  verArchivo(d: Documento): void {
    this.error.set('');

    const ventana = window.open('', '_blank');
    if (!ventana) {
      this.error.set('El navegador bloqueó la pestaña nueva. Permítela o usa la descarga');
      return;
    }

    this.documentosService.descargar(d.id).subscribe({
      next: (blob) => {
        if (blob.type === 'application/pdf' || blob.type.startsWith('image/')) {
          ventana.location.href = URL.createObjectURL(blob);
        } else {
          ventana.close();
          this.error.set('Este tipo de archivo no se puede mostrar, usa la descarga');
        }
      },
      error: () => {
        ventana.close();
        this.error.set('No se pudo abrir el documento');
      },
    });
  }

  descargar(d: Documento): void {
    this.error.set('');
    this.documentosService.descargar(d.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = d.nombre;
        enlace.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      error: () => this.error.set('No se pudo descargar el documento'),
    });
  }

  pedirEliminar(d: Documento): void {
    this.confirmandoId.set(d.id);
  }

  cancelarEliminar(): void {
    this.confirmandoId.set(null);
  }

  eliminar(d: Documento): void {
    this.documentosService.eliminar(d.id).subscribe({
      next: () => {
        this.confirmandoId.set(null);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.confirmandoId.set(null);
        this.error.set(
          err.status === 403
            ? 'No tienes permiso para eliminar este documento'
            : 'No se pudo eliminar el documento',
        );
      },
    });
  }

  private mensaje(err: HttpErrorResponse): string {
    if (err.status === 413) return 'El archivo supera los 5 MB';
    if (err.status === 403) return 'No tienes permiso para subir documentos a esta solicitud';
    const m = err.error?.message;
    if (err.status >= 400 && err.status < 500) {
      if (Array.isArray(m)) return m.join('. ');
      if (typeof m === 'string') return m;
    }
    return 'No se pudo subir el documento';
  }
}