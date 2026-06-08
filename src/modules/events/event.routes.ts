import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/role.middleware";
import { rateLimit } from "../../middlewares/rateLimit.middleware";
const router = Router();

// public
router.get("/",authMiddleware,rateLimit(5,10), EventController.getAll);
router.get("/:id", EventController.getOne);

// protected
router.post("/", authMiddleware,isAdmin, EventController.create);
router.put("/update/:id", authMiddleware, EventController.updateEvent);
router.delete("/:id", authMiddleware,isAdmin, EventController.delete);

router.post("/join", authMiddleware, rateLimit(5, 60), EventController.join);
router.post("/leave", authMiddleware, rateLimit(5, 60), EventController.leave);

export default router;