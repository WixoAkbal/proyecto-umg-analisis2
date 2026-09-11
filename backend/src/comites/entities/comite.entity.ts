import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AuditoriaOperativa } from '../../base/entities/auditoria-operativa.entity';

@Entity('comites')
export class Comite extends AuditoriaOperativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;
}