import { prisma } from "../db/prisma.js";

const isAuthor = (req) => req.user?.role === "AUTHOR";
const userSelect = { select: { id: true, username: true } };

// returns the post only if the current requester is allowed to see it
async function findVisiblePost(req) {
    const post = await prisma.post.findUnique({
        where: { id: Number(req.params.postId) },
    });
    if (!post || (!post.published && !isAuthor(req))) return null;
    return post;
}

export async function listComments(req, res, next) {
    try {
        const post = await findVisiblePost(req);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const comments = await prisma.comment.findMany({
            where: { postId: post.id },
            orderBy: { createdAt: "asc" },
            include: { user: userSelect },
        });

        res.json(comments);
    } catch (err) {
        next(err);
    }
}

export async function createComment(req, res, next) {
    try {
        const post = await findVisiblePost(req);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const comment = await prisma.comment.create({
            data: {
                content: req.body.content,
                postId: post.id,
                userId: req.user.id,
            },
            include: { user: userSelect },
        });

        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
}

export async function updateComment(req, res, next) {
    try {
        const comment = await prisma.comment.findFirst({
            where: { id: Number(req.params.id), postId: Number(req.params.postId) },
        });
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        const updated = await prisma.comment.update({
            where: { id: comment.id },
            data: { content: req.body.content },
            include: { user: userSelect },
        });

        res.json(updated);
    } catch (err) {
        next(err);
    }
}

export async function deleteComment(req, res, next) {
    try {
        const comment = await prisma.comment.findFirst({
            where: { id: Number(req.params.id), postId: Number(req.params.postId) },
        });
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        await prisma.comment.delete({ where: { id: comment.id } });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}