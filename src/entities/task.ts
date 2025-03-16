import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ProjectEntity } from "./project";
import { Status } from "@/models/shared";

@Entity({ name: "tasks" })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  entityType!: "task";

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "enum", enum: Status, default: Status.Inbox })
  status!: Status;

  @Column({ type: "timestamp", nullable: true })
  startDate?: Date;

  @Column({ type: "timestamp", nullable: true })
  endDate?: Date;

  @Column()
  projectId!: number;

  @ManyToOne(() => ProjectEntity, { onDelete: "CASCADE" })
  project!: ProjectEntity;

  @Column({ type: "varchar", length: 255, nullable: true })
  imageUrl?: string;
}
