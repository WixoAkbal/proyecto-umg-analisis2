import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TableModule } from '@openng/optimus-ui/table';
import { ReportesService, Resumen, ResumenPorConvocatoria } from './reportes.service';

@Component({
  selector: 'app-reportes',
  imports: [ButtonModule, TableModule],
  templateUrl: './reportes.html',
})
export class Reportes {
  private readonly service = inject(ReportesService);

  resumen = signal<Resumen | null>(null);
  cargando = signal(false);
  error = signal('');

  estados = computed(() => this.resumen()?.porEstado ?? []);
  convocatorias = computed(() => this.resumen()?.porConvocatoria ?? []);

  constructor() {
    afterNextRender(() => this.cargar());
  }

  cargar(): void {
    this.error.set('');
    this.cargando.set(true);

    this.service.resumen().subscribe({
      next: (datos) => {
        this.resumen.set(datos);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(
          err.status === 403
            ? 'No tienes permiso para ver los reportes'
            : 'No se pudo cargar el reporte',
        );
      },
    });
  }

  cantidad(c: ResumenPorConvocatoria, estadoId: number): number {
    return c.porEstado[estadoId] ?? 0;
  }

  etiqueta(nombre: string): string {
    return nombre.replace(/_/g, ' ');
  }

  exportarCsv(): void {
    const estados = this.estados();
    const encabezado = ['Convocatoria', ...estados.map((e) => this.etiqueta(e.estado)), 'Total'];
    const filas = this.convocatorias().map((c) => [
      c.convocatoria,
      ...estados.map((e) => String(this.cantidad(c, e.estadoId))),
      String(c.total),
    ]);

    const texto = [encabezado, ...filas]
      .map((fila) => fila.map((celda) => `"${celda.replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + texto], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'reporte-solicitudes.csv';
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}