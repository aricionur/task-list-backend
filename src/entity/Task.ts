import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  status: string;

  @Column({ name: "due_date", nullable: true })
  dueDate?: Date;
}

export type CreateTask = Omit<Task, "id">;
