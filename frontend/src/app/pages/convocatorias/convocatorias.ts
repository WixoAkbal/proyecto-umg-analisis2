import { Component, afterNextRender, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TableModule } from '@openng/optimus-ui/table';
import { AuthService } from '../../core/auth.service';
import { TiposBecasService, TipoBeca } from '../tipos-becas/tipos-becas.service';
import { Convocatoria, ConvocatoriaForm, ConvocatoriasService } from './convocatorias.service';
import { EstadoConvocatoria, EstadosConvocatoriasService } from './estados-convocatorias.service';

@Component({
  selector: 'app-convocatorias',
  imports: [FormsModule, ButtonModule, DialogModule, InputTextModule, TableModule],
  templateUrl: './convocatorias.html',
})
export class Convocatorias {
  private readonly service = inject(ConvocatoriasService);
  private readonly tiposService = inject(TiposBecasService);
  private readonly estadosService = inject(EstadosConvocatoriasService);
  private readonly auth = inject(AuthService);

  convocatorias = signal<Convocatoria[]>([]);
  tipos = signal<TipoBeca[]>([]);
  estados = signal<EstadoConvocatoria[]>([]);
  cargando = signal(false);
  error = signal('');
  esAdmin = signal(false);

  dialogoVisible = signal(false);
  guardando = signal(false);
  errorForm = signal('');
  editandoId: number | null = null;
  nombre = '';
  descripcion = '';
  fechaApertura = '';
  fechaCierre = '';
  cupos: number | null = null;
  tipoBecaId: number | null = null;
  estadoId: number | null = null;
  confirmarVisible = signal(false);
  eliminando = signal(false);
  errorEliminar = signal('');
  convocatoriaAEliminar: Convocatoria | null = null;

  constructor() {
    afterNextRender(() => {
      this.esAdmin.set(this.auth.esAdmin());
      this.cargar();
      this.tiposService.listar().subscribe({ next: (datos) => this.tipos.set(datos) });
      this.estadosService.listar().subscribe({ next: (datos) => this.estados.set(datos) });
    });
  }

  cargar(): void {
    this.error.set('');
    this.cargando.set(true);

    this.service.listar().subscribe({
      next: (datos) => {
        this.convocatorias.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudieron cargar las convocatorias');
      },
    });
  }

  soloFecha(valor: string | null | undefined): string {
    return valor ? valor.slice(0, 10) : '';
  }

  nuevo(): void {
    this.editandoId = null;
    this.nombre = '';
    this.descripcion = '';
    this.fechaApertura = '';
    this.fechaCierre = '';
    this.cupos = null;
    this.tipoBecaId = null;
    this.estadoId = null;
    this.errorForm.set('');
    this.dialogoVisible.set(true);
  }

  editar(c: Convocatoria): void {
    this.editandoId = c.id;
    this.nombre = c.nombre;
    this.descripcion = c.descripcion ?? '';
    this.fechaApertura = this.soloFecha(c.fechaApertura);
    this.fechaCierre = this.soloFecha(c.fechaCierre);
    this.cupos = c.cuposDisponibles;
    this.tipoBecaId = c.tipoBeca?.id ?? null;
    this.estadoId = c.estadoConvocatoria?.id ?? null;
    this.errorForm.set('');
    this.dialogoVisible.set(true);
  }

  guardar(): void {
    const nombre = this.nombre.trim();
    if (!nombre) {
      this.errorForm.set('El nombre es obligatorio');
      return;
    }
    if (!this.fechaApertura || !this.fechaCierre) {
      this.errorForm.set('Las fechas de apertura y cierre son obligatorias');
      return;
    }
    if (this.fechaCierre < this.fechaApertura) {
      this.errorForm.set('La fecha de cierre no puede ser anterior a la de apertura');
      return;
    }
    if (this.cupos !== null && (!Number.isInteger(this.cupos) || this.cupos < 0)) {
      this.errorForm.set('Los cupos deben ser un número entero de 0 en adelante');
      return;
    }
    if (this.tipoBecaId === null || this.estadoId === null) {
      this.errorForm.set('Selecciona el tipo de beca y el estado');
      return;
    }

    const datos: ConvocatoriaForm = {
      nombre,
      descripcion: this.descripcion.trim(),
      fechaApertura: this.fechaApertura,
      fechaCierre: this.fechaCierre,
      cuposDisponibles: this.cupos ?? 0,
      tipoBecaId: this.tipoBecaId,
      estadoConvocatoriaId: this.estadoId,
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

    pedirEliminar(c: Convocatoria): void {
    this.convocatoriaAEliminar = c;
    this.errorEliminar.set('');
    this.confirmarVisible.set(true);
  }

  confirmarEliminar(): void {
    if (!this.convocatoriaAEliminar) return;

    this.errorEliminar.set('');
    this.eliminando.set(true);

    this.service.eliminar(this.convocatoriaAEliminar.id).subscribe({
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
    if (err.status === 400) return 'Revisa los datos del formulario';
    if (err.status === 403) return 'No tienes permiso para esta accion';
    return 'No se pudo guardar la convocatoria';
  }
}