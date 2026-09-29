import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { Solicitud } from '../../solicitudes/entities/solicitude.entity';
import { Comite } from '../../comites/entities/comite.entity';

@Entity('evaluaciones')
export class Evaluacion extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  puntaje: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => Solicitud)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: Solicitud;

  @ManyToOne(() => Comite)
  @JoinColumn({ name: 'comite_id' })
  comite: Comite;
}