import { Component, afterNextRender, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TableModule } from '@openng/optimus-ui/table';
import { AuthService } from '../../core/auth.service';
import { TiposBecasService, TipoBeca } from './tipos-becas.service';

@Component({
  selector: 'app-tipos-becas',
  imports: [FormsModule, ButtonModule, DialogModule, InputTextModule, TableModule],
  templateUrl: './tipos-becas.html',
})
export class TiposBecas {
  private readonly service = inject(TiposBecasService);
  private readonly auth = inject(AuthService);

  tipos = signal<TipoBeca[]>([]);
  cargando = signal(false);
  error = signal('');
  esAdmin = signal(false);

  dialogoVisible = signal(false);
  guardando = signal(false);
  errorForm = signal('');
  editandoId: number | null = null;
  nombre = '';
  descripcion = '';

  confirmarVisible = signal(false);
  eliminando = signal(false);
  errorEliminar = signal('');
  tipoAEliminar: TipoBeca | null = null;

  constructor() {
    afterNextRender(() => {
      this.esAdmin.set(this.auth.esAdmin());
      this.cargar();
    });
  }

  cargar(): void {
    this.error.set('');
    this.cargando.set(true);

    this.service.listar().subscribe({
      next: (datos) => {
        this.tipos.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudieron cargar los tipos de becas');
      },
    });
  }

  nuevo(): void {
    this.editandoId = null;
    this.nombre = '';
    this.descripcion = '';
    this.errorForm.set('');
    this.dialogoVisible.set(true);
  }

  editar(tipo: TipoBeca): void {
    this.editandoId = tipo.id;
    this.nombre = tipo.nombre;
    this.descripcion = tipo.descripcion ?? '';
    this.errorForm.set('');
    this.dialogoVisible.set(true);
  }

  guardar(): void {
    const nombre = this.nombre.trim();
    if (!nombre) {
      this.errorForm.set('El nombre es obligatorio');
      return;
    }

    const datos = { nombre, descripcion: this.descripcion.trim() };
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

  pedirEliminar(tipo: TipoBeca): void {
    this.tipoAEliminar = tipo;
    this.errorEliminar.set('');
    this.confirmarVisible.set(true);
  }

  confirmarEliminar(): void {
    if (!this.tipoAEliminar) return;

    this.errorEliminar.set('');
    this.eliminando.set(true);

    this.service.eliminar(this.tipoAEliminar.id).subscribe({
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
    if (err.status === 400) return 'Revisa los datos: nombre hasta 100 caracteres y descripción hasta 200';
    if (err.status === 403) return 'No tienes permiso para esta acción';
    return 'No se pudo guardar. Si el nombre ya existe, usa otro';
  }
}