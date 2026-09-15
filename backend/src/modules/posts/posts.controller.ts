import { Request, Response, NextFunction } from 'express';
import * as postsService from './posts.service';
import { createPostSchema, updatePostSchema, postStatusFilterSchema } from './posts.validation';
import { BadRequestError, param } from '@/types';
import { PostStatus } from '@prisma/client';

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createPostSchema.parse(req.body);
    const post = await postsService.createPost(req.user!.userId, data);
    res.status(201).json({ data: post });
  } catch (err) { next(err); }
}

export async function getMyPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, page, limit } = postStatusFilterSchema.parse(req.query);
    const result = await postsService.getMyPosts(
      req.user!.userId,
      status as PostStatus | undefined,
      page,
      limit,
    );
    res.json(result);
  } catch (err) { next(err); }
}

export async function getPostById(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await postsService.getPostById(req.user!.userId, param(req.params.id));
    res.json({ data: post });
  } catch (err) { next(err); }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updatePostSchema.parse(req.body);
    const post = await postsService.updatePost(req.user!.userId, param(req.params.id), data);
    res.json({ data: post });
  } catch (err) { next(err); }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    await postsService.deletePost(req.user!.userId, param(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function submitPost(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await postsService.submitPost(req.user!.userId, param(req.params.id));
    res.json({ data: post });
  } catch (err) { next(err); }
}

export async function addMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) throw new BadRequestError('At least one evidence file is required');
    const media = await postsService.addMedia(req.user!.userId, param(req.params.id), files);
    res.status(201).json({ data: media });
  } catch (err) { next(err); }
}

export async function removeMedia(req: Request, res: Response, next: NextFunction) {
  try {
    await postsService.removeMedia(req.user!.userId, param(req.params.id), param(req.params.mediaId));
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function upvotePost(req: Request, res: Response, next: NextFunction) {
  try {
    const upvote = await postsService.upvotePost(req.user!.userId, param(req.params.id));
    res.status(201).json({ data: upvote });
  } catch (err) { next(err); }
}

export async function removeUpvote(req: Request, res: Response, next: NextFunction) {
  try {
    await postsService.removeUpvote(req.user!.userId, param(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
}
