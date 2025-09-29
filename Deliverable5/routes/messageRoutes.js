import express from "express";
import {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage
} from "../controller/messageController";
const router = express.Router();

// CREATE
router.post("/", createMessage);

// READ
router.get("/", getAllMessages);
router.get("/:id", getMessageById);

// UPDATE
router.put("/:id", updateMessage);

// DELETE
router.delete("/:id", deleteMessage);

export default router;
