import { prisma } from "../db/prisma.js";

const isAuthor = (req) => req.user?.role === "AUTHOR";
const authorSelect = { select: { id: true, username: true } };

export async function listPosts(req, res, next) {
    try {
        const showAll = isAuthor(req) && req.query.all === "true";

        const posts = await prisma.post.findMany({
            where: showAll ? {} : { published: true },
            orderBy: { createdAt: "desc" },
            include: {
                author: authorSelect,
                _count: { select: { comments: true } },
            },
        });

        res.json(posts);
    } catch (err) {
        next(err);
    }
}

export async function getPost(req, res, next) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: Number(req.params.id) },
            include: { author: authorSelect },
        });

        // unpublished posts look like they don't exist to everyone but the author
        if (!post || (!post.published && !isAuthor(req))) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(post);
    } catch (err) {
        next(err);
    }
}

export async function createPost(req, res, next) {
    try {
        const { title, content, published } = req.body;

        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: published ?? false,
                authorId: req.user.id,
            },
        });

        res.status(201).json(post);
    } catch (err) {
        next(err);
    }
}

export async function updatePost(req, res, next) {
    try {
        const { title, content } = req.body;

        const post = await prisma.post.update({
            where: { id: Number(req.params.id) },
            data: { title, content },
        });

        res.json(post);
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Post not found" });
        }
        next(err);
    }
}

export async function setPublished(req, res, next) {
    try {
        const post = await prisma.post.update({
            where: { id: Number(req.params.id) },
            data: { published: req.body.published },
        });

        res.json(post);
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Post not found" });
        }
        next(err);
    }
}

export async function deletePost(req, res, next) {
    try {
        await prisma.post.delete({ where: { id: Number(req.params.id) } });
        res.status(204).end();
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ error: "Post not found" });
        }
        next(err);
    }
}