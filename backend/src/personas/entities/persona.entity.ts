import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { User } from '../../user/entity/user.entity';
import { NivelesAcademico } from '../../niveles-academicos/entities/niveles-academico.entity';

@Entity('personas')
export class Persona extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'primer_nombre', length: 100 })
  primerNombre: string;

  @Column({ name: 'segundo_nombre', length: 100, nullable: true })
  segundoNombre: string;

  @Column({ name: 'tercer_nombre', length: 100, nullable: true })
  tercerNombre: string;

  @Column({ name: 'primer_apellido', length: 100 })
  primerApellido: string;

  @Column({ name: 'segundo_apellido', length: 100, nullable: true })
  segundoApellido: string;

  @Column({ name: 'apellido_casada', length: 100, nullable: true })
  apellidoCasada: string;

  @Column({ length: 20, unique: true })
  dpi: string;

  @Column({ name: 'institucion_educativa', length: 200 })
  institucionEducativa: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ type: 'enum', enum: ['masculino', 'femenino'] })
  genero: string;

  @Column({ name: 'fecha_nacimiento', type: 'date' })
  fechaNacimiento: Date;

  @ManyToOne(() => NivelesAcademico)
  @JoinColumn({ name: 'nivel_academico_id' })
  nivelAcademico: NivelesAcademico;

  @OneToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;
}
