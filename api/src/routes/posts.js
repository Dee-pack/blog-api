import { Router } from "express";
import { body, param } from "express-validator";
import commentsRouter from "./comments.js";
import {
    authenticate,
    requireAuthor,
    optionalAuthenticate,
} from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
    listPosts,
    getPost,
    createPost,
    updatePost,
    setPublished,
    deletePost,
} from "../controllers/postsController.js";

const router = Router();

router.use("/:postId/comments", commentsRouter);

const idParam = param("id").isInt({ min: 1 }).withMessage("Invalid post id");

const postBody = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("published").optional().isBoolean().toBoolean(),
];

router.get("/", optionalAuthenticate, listPosts);
router.get("/:id", idParam, validate, optionalAuthenticate, getPost);

router.post("/", authenticate, requireAuthor, postBody, validate, createPost);
router.put("/:id", authenticate, requireAuthor, idParam, postBody, validate, updatePost);
router.patch(
    "/:id/publish",
    authenticate,
    requireAuthor,
    idParam,
    body("published").isBoolean().withMessage("published must be true or false").bail().toBoolean(),
    validate,
    setPublished
);
router.delete("/:id", authenticate, requireAuthor, idParam, validate, deletePost);

export default router;