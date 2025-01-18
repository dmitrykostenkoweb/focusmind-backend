import { Status } from "@/models/shared";

export interface RawTask {
  id: number;
  name: string;
  description?: string;
  status?: Status;
  start_date?: string;
  end_date?: string;
  project_id?: number;
  area_id?: number;
  image_url?: string;
}

export interface Task {
  id: number;
  name: string;
  description?: string;
  status?: Status;
  startDate?: string;
  endDate?: string;
  projectId?: number;
  areaId?: number;
  imageUrl?: string;
}
