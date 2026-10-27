import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';
import { User } from '../../user/entity/user.entity';
import { Solicitud } from '../../solicitudes/entities/solicitude.entity';

@Entity('autorizaciones')
export class Autorizacion extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Solicitud)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: Solicitud;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  monto: number;

  @Column({ name: 'requiere_confirmacion', type: 'boolean', default: false })
  requiereConfirmacion: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'autorizado_por' })
  autorizadoPor: User;

  @Column({ name: 'fecha_autorizacion', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaAutorizacion: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'confirmado_por' })
  confirmadoPor: User | null;

  @Column({ name: 'fecha_confirmacion', type: 'datetime', nullable: true })
  fechaConfirmacion: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comentario: string | null;
}