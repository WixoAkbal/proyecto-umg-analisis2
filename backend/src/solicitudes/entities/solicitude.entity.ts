import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { Persona } from '../../personas/entities/persona.entity';
import { Convocatoria } from '../../convocatorias/entities/convocatoria.entity';
import { Comite } from '../../comites/entities/comite.entity';
import { EstadosSolicitud } from '../../estados-solicitudes/entities/estados-solicitude.entity';

@Entity('solicitudes')
export class Solicitud extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Persona)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @ManyToOne(() => Convocatoria)
  @JoinColumn({ name: 'convocatoria_id' })
  convocatoria: Convocatoria;

  @ManyToOne(() => Comite, { nullable: true })
  @JoinColumn({ name: 'comite_id' })
  comite: Comite;

  @ManyToOne(() => EstadosSolicitud)
  @JoinColumn({ name: 'estado_solicitud_id' })
  estadoSolicitud: EstadosSolicitud;
}