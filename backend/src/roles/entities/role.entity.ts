import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  descripcion: string;

  @Column({ name: 'creado_por', nullable: true })
  creadoPor: number;

  @CreateDateColumn({ name: 'fecha_hora_creado' })
  fechaHoraCreado: Date;

  @Column({ name: 'modificado_por', nullable: true })
  modificadoPor: number;

  @UpdateDateColumn({ name: 'fecha_hora_modificado', nullable: true })
  fechaHoraModificado: Date;
}