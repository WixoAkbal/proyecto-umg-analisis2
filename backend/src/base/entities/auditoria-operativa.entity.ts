import { Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EstadoRegistro } from '../../estados-registro/entities/estados-registro.entity';

export abstract class AuditoriaOperativa {
  @Column({ name: 'creado_por', nullable: true })
  creadoPor: number;

  @CreateDateColumn({ name: 'fecha_hora_creado' })
  fechaHoraCreado: Date;

  @Column({ name: 'modificado_por', nullable: true })
  modificadoPor: number;

  @UpdateDateColumn({ name: 'fecha_hora_modificado', nullable: true })
  fechaHoraModificado: Date;

  @ManyToOne(() => EstadoRegistro, { nullable: true })
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoRegistro;


  @ManyToOne(() => EstadoRegistro, { nullable: true })
  @JoinColumn({ name: 'estado_anterior_id' })
  estadoAnterior: EstadoRegistro;
}