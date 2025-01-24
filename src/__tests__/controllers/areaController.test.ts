import request from "supertest";
import express from "express";
import areaRouter from "@/routes/area";
import { AreaEntity } from "@/entities/area";
import {
  getAllAreasService,
  getAreaByIdService,
  createAreaService,
  updateAreaService,
  deleteAreaService,
} from "@/services/area";

jest.mock("@/services/area");

const app = express();
app.use(express.json());
app.use("/api", areaRouter);

describe("Area Controller", () => {
  describe("GET /api/areas", () => {
    it("should return all areas", async () => {
      const mockAreas: AreaEntity[] = [
        {
          id: 1,
          name: "Area 1",
          description: "Description 1",
        },
      ];
      (getAllAreasService as jest.Mock).mockResolvedValue(mockAreas);

      const response = await request(app).get("/api/areas");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAreas);
    });
  });

  describe("GET /api/areas/:id", () => {
    it("should return a single area by ID", async () => {
      const mockArea: AreaEntity = {
        id: 1,
        name: "Area 1",
        description: "Description 1",
        imageUrl: "ImageUrl 1",
      };
      (getAreaByIdService as jest.Mock).mockResolvedValue(mockArea);

      const response = await request(app).get("/api/areas/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArea);
    });

    it("should return 404 if area not found", async () => {
      (getAreaByIdService as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/api/areas/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Area not found." });
    });
  });

  describe("POST /api/areas", () => {
    it("should create a new area", async () => {
      const newArea: AreaEntity = {
        id: 1,
        name: "New Area",
        description: "New Description",
        imageUrl: "New ImageUrl",
      };
      (createAreaService as jest.Mock).mockResolvedValue(newArea);

      const response = await request(app).post("/api/areas").send({
        name: "New Area",
        description: "New Description",
        imageUrl: "New ImageUrl",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newArea);
    });

    it("should return 400 if name is missing", async () => {
      const response = await request(app).post("/api/areas").send({
        description: "New Description",
        imageUrl: "New ImageUrl",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Name is required." });
    });
  });

  describe("PUT /api/areas/:id", () => {
    it("should update an existing area", async () => {
      const updatedArea: AreaEntity = {
        id: 1,
        name: "Updated Area",
        description: "Updated Description",
        imageUrl: "Updated ImageUrl",
      };
      (updateAreaService as jest.Mock).mockResolvedValue(updatedArea);

      const response = await request(app).put("/api/areas/1").send({
        name: "Updated Area",
        description: "Updated Description",
        imageUrl: "Updated ImageUrl",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedArea);
    });

    it("should return 404 if area not found", async () => {
      (updateAreaService as jest.Mock).mockResolvedValue(null);

      const response = await request(app).put("/api/areas/999").send({
        name: "Updated Area",
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Area not found." });
    });
  });

  describe("DELETE /api/areas/:id", () => {
    it("should delete an area", async () => {
      (deleteAreaService as jest.Mock).mockResolvedValue(true);

      const response = await request(app).delete("/api/areas/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Area deleted successfully" });
    });

    it("should return 404 if area not found", async () => {
      (deleteAreaService as jest.Mock).mockResolvedValue(false);

      const response = await request(app).delete("/api/areas/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Area not found." });
    });
  });

  describe("POST /api/areas transaction", () => {
    it("should rollback on failure", async () => {
      const newArea1 = {
        name: "Area 1",
        description: "Description 1",
        imageUrl: "ImageUrl 1",
      };
      (createAreaService as jest.Mock).mockResolvedValue(newArea1);
      const response1 = await request(app).post("/api/areas").send(newArea1);
      expect(response1.status).toBe(201);

      (createAreaService as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Database Error");
      });

      const newArea2 = {
        name: "Area 2",
        description: "Description 2",
        imageUrl: "ImageUrl 2",
      };
      const response2 = await request(app).post("/api/areas").send(newArea2);
      expect(response2.status).toBe(500);
      expect(response2.body).toEqual({ error: "Internal server error." });
    });

    it("should commit on success", async () => {
      const newArea1 = {
        name: "Area 1",
        description: "Description 1",
        imageUrl: "ImageUrl 1",
      };
      const newArea2 = {
        name: "Area 2",
        description: "Description 2",
        imageUrl: "ImageUrl 2",
      };

      (createAreaService as jest.Mock)
        .mockResolvedValueOnce(newArea1)
        .mockResolvedValueOnce(newArea2);

      const response1 = await request(app).post("/api/areas").send(newArea1);
      expect(response1.status).toBe(201);

      const response2 = await request(app).post("/api/areas").send(newArea2);
      expect(response2.status).toBe(201);
    });
  });
});
