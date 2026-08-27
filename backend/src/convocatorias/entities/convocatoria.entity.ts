import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { TiposBeca } from '../../tipos-becas/entities/tipos-beca.entity';
import { EstadosConvocatoria } from '../../estados-convocatorias/entities/estados-convocatoria.entity';

@Entity('convocatorias')
export class Convocatoria extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'fecha_apertura', type: 'date' })
  fechaApertura: Date;

  @Column({ name: 'fecha_cierre', type: 'date' })
  fechaCierre: Date;

  @Column({ name: 'cupos_disponibles', type: 'int', default: 0 })
  cuposDisponibles: number;

  @ManyToOne(() => TiposBeca)
  @JoinColumn({ name: 'tipo_beca_id' })
  tipoBeca: TiposBeca;

  @ManyToOne(() => EstadosConvocatoria)
  @JoinColumn({ name: 'estado_convocatoria_id' })
  estadoConvocatoria: EstadosConvocatoria;
}