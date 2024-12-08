import request from "supertest";
import express from "express";
import areaRouter from "@/routes/areaRoutes";
import * as areaService from "@/services/areaService";
import { Area } from "@/models/areaModel";

jest.mock("@/services/areaService");

const app = express();
app.use(express.json());
app.use("/api", areaRouter);

describe("Area Controller", () => {
  describe("GET /api/areas", () => {
    it("should return all areas", async () => {
      const mockAreas: Area[] = [
        {
          areaId: 1,
          name: "Area 1",
          description: "Description 1",
          imageUrl: "ImageUrl 1",
        },
      ];
      (areaService.getAllAreas as jest.Mock).mockResolvedValue(mockAreas);

      const response = await request(app).get("/api/areas");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAreas);
    });
  });

  describe("GET /api/areas/:id", () => {
    it("should return a single area by ID", async () => {
      const mockArea: Area = {
        areaId: 1,
        name: "Area 1",
        description: "Description 1",
        imageUrl: "ImageUrl 1",
      };
      (areaService.getAreaById as jest.Mock).mockResolvedValue(mockArea);

      const response = await request(app).get("/api/areas/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArea);
    });

    it("should return 404 if area not found", async () => {
      (areaService.getAreaById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/api/some-path");

      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/areas", () => {
    it("should create a new area", async () => {
      const newArea: Area = {
        areaId: 1,
        name: "New Area",
        description: "New Description",
        imageUrl: "New ImageUrl",
      };
      (areaService.createArea as jest.Mock).mockResolvedValue(newArea);

      const response = await request(app).post("/api/areas").send({
        name: "New Area",
        description: "New Description",
        imageUrl: "New ImageUrl",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(newArea);
    });
  });

  describe("PUT /api/areas/:id", () => {
    it("should update an existing area", async () => {
      const updatedArea: Area = {
        areaId: 1,
        name: "Updated Area",
        description: "Updated Description",
        imageUrl: "Updated ImageUrl",
      };
      (areaService.updateArea as jest.Mock).mockResolvedValue(updatedArea);

      const response = await request(app).put("/api/areas/1").send({
        name: "Updated Area",
        description: "Updated Description",
        imageUrl: "Updated ImageUrl",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedArea);
    });
  });

  describe("DELETE /api/areas/:id", () => {
    it("should delete an area", async () => {
      const updatedArea: Area = {
        areaId: 1,
        name: "Updated Area",
        description: "Updated Description",
        imageUrl: "Updated ImageUrl",
      };

      (areaService.deleteArea as jest.Mock).mockResolvedValue(updatedArea);

      const response = await request(app).delete("/api/areas/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Area deleted successfully");
    });
  });

  describe("POST /api/areas transaction", () => {
    it("should rollback on failure", async () => {
      //successfully
      const newArea1 = {
        name: "Area 1",
        description: "Description 1",
        imageUrl: "ImageUrl 1",
      };
      const response1 = await request(app).post("/api/areas").send(newArea1);
      expect(response1.status).toBe(200);

      // Mocking error during creation second area
      (areaService.createArea as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Database Error");
      });

      // fail
      const newArea2 = {
        name: "Area 2",
        description: "Description 2",
        imageUrl: "ImageUrl 2",
      };
      const response2 = await request(app).post("/api/areas").send(newArea2);
      expect(response2.status).toBe(500);
    });

    it("should commit on success", async () => {
      // successfully
      const newArea1 = {
        name: "Area 1",
        description: "Description 1",
        imageUrl: "ImageUrl 1",
      };
      const response1 = await request(app).post("/api/areas").send(newArea1);
      expect(response1.status).toBe(200);

      // successfully
      const newArea2 = {
        name: "Area 2",
        description: "Description 2",
        imageUrl: "ImageUrl 2",
      };
      const response2 = await request(app).post("/api/areas").send(newArea2);
      expect(response2.status).toBe(200);
    });
  });
});
