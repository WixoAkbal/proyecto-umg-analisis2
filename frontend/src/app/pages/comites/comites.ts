import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TableModule } from '@openng/optimus-ui/table';
import { Comite, ComitesService, Evaluador, MiembroComite } from '../evaluaciones/comites.service';

@Component({
  selector: 'app-comites',
  imports: [FormsModule, ButtonModule, DialogModule, InputTextModule, TableModule],
  templateUrl: './comites.html',
})
export class Comites {
  private readonly service = inject(ComitesService);

  comites = signal<Comite[]>([]);
  miembros = signal<MiembroComite[]>([]);
  evaluadores = signal<Evaluador[]>([]);
  cargando = signal(false);
  error = signal('');

  dialogoVisible = signal(false);
  guardando = signal(false);
  errorForm = signal('');
  editandoId: number | null = null;
  nombre = '';

  confirmarVisible = signal(false);
  eliminando = signal(false);
  errorEliminar = signal('');
  comiteAEliminar: Comite | null = null;

  miembrosVisible = signal(false);
  comiteSeleccionado = signal<Comite | null>(null);
  errorMiembros = signal('');
  trabajando = signal(false);
  evaluadorId: number | null = null;

  miembrosDelComite = computed(() => {
    const c = this.comiteSeleccionado();
    return c ? this.miembros().filter((m) => m.comiteId === c.id) : [];
  });

  disponibles = computed(() => {
    const yaEstan = new Set(this.miembrosDelComite().map((m) => m.evaluadorId));
    return this.evaluadores().filter((e) => !yaEstan.has(e.id));
  });

  constructor() {
    afterNextRender(() => {
      this.cargar();
      this.service.listarEvaluadores().subscribe({ next: (datos) => this.evaluadores.set(datos) });
    });
  }

  cargar(): void {
    this.error.set('');
    this.cargando.set(true);

    this.service.listar().subscribe({
      next: (datos) => {
        this.comites.set(datos);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(
          err.status === 403
            ? 'No tienes permiso para ver los comites'
            : 'No se pudieron cargar los comites',
        );
      },
    });
    this.cargarMiembros();
  }

  private cargarMiembros(): void {
    this.service.listarMiembros().subscribe({
      next: (datos) => this.miembros.set(datos),
      error: () => this.error.set('No se pudieron cargar los miembros'),
    });
  }

  nombresDe(comiteId: number): string {
    const nombres = this.miembros()
      .filter((m) => m.comiteId === comiteId)
      .map((m) => `${m.evaluador?.nombre ?? ''} ${m.evaluador?.apellido ?? ''}`.trim());
    return nombres.length ? nombres.join(', ') : 'Sin miembros';
  }

  nuevo(): void {
    this.editandoId = null;
    this.nombre = '';
    this.errorForm.set('');
    this.dialogoVisible.set(true);
  }

  editar(c: Comite): void {
    this.editandoId = c.id;
    this.nombre = c.nombre;
    this.errorForm.set('');
    this.dialogoVisible.set(true);
  }

  guardar(): void {
    const nombre = this.nombre.trim();
    if (!nombre) {
      this.errorForm.set('El nombre es obligatorio');
      return;
    }

    this.errorForm.set('');
    this.guardando.set(true);

    const peticion =
      this.editandoId === null
        ? this.service.crear(nombre)
        : this.service.actualizar(this.editandoId, nombre);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.dialogoVisible.set(false);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorForm.set(
          err.status === 400
            ? 'Revisa el nombre: es obligatorio y admite hasta 150 caracteres'
            : err.status === 403
              ? 'No tienes permiso para esta accion'
              : 'No se pudo guardar el comite',
        );
      },
    });
  }

  pedirEliminar(c: Comite): void {
    this.comiteAEliminar = c;
    this.errorEliminar.set('');
    this.confirmarVisible.set(true);
  }

  confirmarEliminar(): void {
    if (!this.comiteAEliminar) return;

    this.errorEliminar.set('');
    this.eliminando.set(true);

    this.service.eliminar(this.comiteAEliminar.id).subscribe({
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

  abrirMiembros(c: Comite): void {
    this.comiteSeleccionado.set(c);
    this.evaluadorId = null;
    this.errorMiembros.set('');
    this.miembrosVisible.set(true);
  }

  agregarMiembro(): void {
    const comite = this.comiteSeleccionado();
    if (!comite) return;
    if (this.evaluadorId === null) {
      this.errorMiembros.set('Selecciona un evaluador');
      return;
    }

    this.errorMiembros.set('');
    this.trabajando.set(true);

    this.service.agregarMiembro(comite.id, this.evaluadorId).subscribe({
      next: () => {
        this.trabajando.set(false);
        this.evaluadorId = null;
        this.cargarMiembros();
      },
      error: (err: HttpErrorResponse) => {
        this.trabajando.set(false);
        this.errorMiembros.set(
          err.status === 403 ? 'No tienes permiso para esta accion' : 'No se pudo agregar al evaluador',
        );
      },
    });
  }

  quitarMiembro(m: MiembroComite): void {
    this.errorMiembros.set('');

    this.service.quitarMiembro(m.comiteId, m.evaluadorId).subscribe({
      next: () => this.cargarMiembros(),
      error: (err: HttpErrorResponse) =>
        this.errorMiembros.set(
          err.status === 403 ? 'No tienes permiso para esta accion' : 'No se pudo quitar al evaluador',
        ),
    });
  }
}