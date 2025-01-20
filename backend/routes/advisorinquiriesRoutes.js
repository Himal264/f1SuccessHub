import express from "express";
import { submitInquiry, getAllInquiries } from "../controllers/advisorController.js";

const inquiryRouter = express.Router();

// POST route to submit inquiry
inquiryRouter.post("/send", submitInquiry);

// GET route to retrieve all inquiries
inquiryRouter.get("/", getAllInquiries);

export default inquiryRouter;
