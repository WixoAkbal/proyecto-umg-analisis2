import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AuditoriaCatalogo } from '../../base/entities/auditoria-catalogo.entity';

@Entity('estados_solicitudes')
export class EstadosSolicitud extends AuditoriaCatalogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  descripcion: string;
}