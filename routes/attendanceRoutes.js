import express from "express";
import { attendanceMark } from "../controllers/attendanceMarkController.js";
const router = express.Router();

router.route("/mark").post(attendanceMark);

export default router;
