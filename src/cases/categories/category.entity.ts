import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//Existe no banco de dados a tabela category com 2 campos.
@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60, nullable: false }) //nullable: false = campo obrigatório/
  name: string;
}
