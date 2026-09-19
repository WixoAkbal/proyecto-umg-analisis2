import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AuditoriaCatalogo } from '../../base/entities/auditoria-catalogo.entity';

@Entity('tipos_documentos')
export class TiposDocumento extends AuditoriaCatalogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  descripcion: string;
}