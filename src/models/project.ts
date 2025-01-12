import { Status } from "@/models/shared";

export interface RawProject {
  id: number;
  name: string;
  status: Status;
  description?: string;
  image_url?: string;
  area_id: number;
}

export interface Project {
  id: number;
  name: string;
  status: Status;
  description?: string;
  imageUrl?: string;
  areaId: number;
}
