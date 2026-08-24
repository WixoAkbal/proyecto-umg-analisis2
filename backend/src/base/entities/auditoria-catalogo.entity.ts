import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AuditoriaCatalogo {
  @Column({ name: 'creado_por', nullable: true })
  creadoPor: number;

  @CreateDateColumn({ name: 'fecha_hora_creado' })
  fechaHoraCreado: Date;

  @Column({ name: 'modificado_por', nullable: true })
  modificadoPor: number;

  @UpdateDateColumn({ name: 'fecha_hora_modificado', nullable: true })
  fechaHoraModificado: Date;

  @Column({ default: true })
  estado: boolean;
}