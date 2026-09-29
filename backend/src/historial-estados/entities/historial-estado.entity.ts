import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { Solicitud } from '../../solicitudes/entities/solicitude.entity';
import { EstadosSolicitud } from '../../estados-solicitudes/entities/estados-solicitude.entity';
import { User } from '../../user/entity/user.entity';

@Entity('historial_estados')
export class HistorialEstado extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comentario: string;

  @ManyToOne(() => Solicitud)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: Solicitud;

  @ManyToOne(() => EstadosSolicitud, { nullable: true })
  @JoinColumn({ name: 'estado_anterior_solicitud_id' })
  estadoAnteriorSolicitud: EstadosSolicitud;

  @ManyToOne(() => EstadosSolicitud)
  @JoinColumn({ name: 'estado_nuevo_solicitud_id' })
  estadoNuevoSolicitud: EstadosSolicitud;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;
}