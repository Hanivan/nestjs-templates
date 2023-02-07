import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'example' })
export class Example {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 50 })
  name: string;
}
