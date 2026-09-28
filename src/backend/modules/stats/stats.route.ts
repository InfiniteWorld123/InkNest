import { Elysia } from "elysia";
import { getPlatformStats } from "./stats.controller";

export const statsRoutes = new Elysia().get("/stats", getPlatformStats);
