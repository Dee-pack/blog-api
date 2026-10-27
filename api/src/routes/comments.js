import { Router } from "express";
import { body, param } from "express-validator";
import {
    authenticate,
    requireAuthor,
    optionalAuthenticate,
} from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
    listComments,
    createComment,
    updateComment,
    deleteComment,
} from "../controllers/commentsController.js";

// mergeParams lets this router see :postId from the parent route
const router = Router({ mergeParams: true });

const postIdParam = param("postId").isInt({ min: 1 }).withMessage("Invalid post id");
const commentIdParam = param("id").isInt({ min: 1 }).withMessage("Invalid comment id");
const commentBody = body("content")
    .trim()
    .notEmpty().withMessage("Comment cannot be empty")
    .isLength({ max: 1000 }).withMessage("Comment is too long (max 1000 characters)");

router.get("/", postIdParam, validate, optionalAuthenticate, listComments);
router.post("/", authenticate, postIdParam, commentBody, validate, createComment);
router.put("/:id", authenticate, requireAuthor, postIdParam, commentIdParam, commentBody, validate, updateComment);
router.delete("/:id", authenticate, requireAuthor, postIdParam, commentIdParam, validate, deleteComment);

export default router;