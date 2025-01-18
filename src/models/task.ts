import { Status } from "@/models/shared";

export interface RawTask {
  id: number;
  title: string;
  status: Status;
  project_id: number;
  description?: string;
  image_url?: string;
}

export interface Task {
  id: number;
  title: string;
  status: Status;
  projectId: number;
  description?: string;
  imageUrl?: string;
}
