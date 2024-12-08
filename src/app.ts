import "module-alias/register";
import express from "express";
import cors from "cors";
import { Express } from "express";
import areaRoutes from "./routes/areaRoutes";

const app: Express = express();
const PORT: string | 3000 = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(areaRoutes);

app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
});
