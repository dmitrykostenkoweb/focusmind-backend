import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { AreaEntity } from "./area";
import { Status } from "@/models/shared";

@Entity({ name: "projects" })
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  areaId!: number;

  @ManyToOne(() => AreaEntity, { onDelete: "CASCADE" })
  area!: AreaEntity;

  @Column({ type: "enum", enum: Status })
  status!: Status;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  imageUrl?: string;
}
