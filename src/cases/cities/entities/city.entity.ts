import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { State } from './state.entity';

//Existe no banco de dados a tabela category com 2 campos.
@Entity('city')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60, nullable: false }) //nullable: false = campo obrigatório/
  name: string;

  @Column({ length: 7, nullable: false })
  ibge: string;

  @ManyToOne(() => State, { eager: true, nullable: false })
  state: State;
}
