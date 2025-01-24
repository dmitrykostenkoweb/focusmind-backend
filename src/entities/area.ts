import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ProjectEntity } from "./project";

@Entity({ name: "areas" })
export class AreaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: "text", nullable: true })
  hex?: string;

  @OneToMany(() => ProjectEntity, (project) => project.area)
  projects?: ProjectEntity[];
}
