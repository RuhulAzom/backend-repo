import express, { Request, Response } from "express";
import ApiController from "../controller/api";
import { isAuthenticated } from "../middleware/authMiddleware";

const UserRoutes = express.Router();

UserRoutes.post("/register", ApiController.register);
UserRoutes.post("/login", ApiController.login);
UserRoutes.post("/check-token", isAuthenticated, ApiController.checkToken);
UserRoutes.get("/fetch-user-data", ApiController.fetchUserData);
UserRoutes.put(
  "/update-user-data",
  isAuthenticated,
  ApiController.updateUserData
);

export { UserRoutes };
