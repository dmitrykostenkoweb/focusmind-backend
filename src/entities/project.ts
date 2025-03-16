import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { AreaEntity } from "./area";
import { TaskEntity } from "./task";
import { Status } from "@/models/shared";

@Entity({ name: "projects" })
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  entityType!: "project";

  @Column()
  name!: string;

  @Column()
  areaId!: number;

  @ManyToOne(() => AreaEntity, (area) => area.projects, { onDelete: "CASCADE" })
  area!: AreaEntity;

  @Column({ type: "enum", enum: Status })
  status!: Status;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  imageUrl?: string;

  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks!: TaskEntity[];
}
