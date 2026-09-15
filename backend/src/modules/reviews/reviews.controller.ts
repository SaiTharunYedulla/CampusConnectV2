import { Request, Response, NextFunction } from 'express';
import * as reviewsService from './reviews.service';
import { reviewSchema, reviewPaginationSchema } from './reviews.validation';
import { param } from '@/types';

export async function getPendingQueue(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = reviewPaginationSchema.parse(req.query);
    const result = await reviewsService.getPendingQueue(page, limit);
    res.json(result);
  } catch (err) { next(err); }
}

export async function getReviewHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = reviewPaginationSchema.parse(req.query);
    const result = await reviewsService.getReviewHistory(req.user!.userId, page, limit);
    res.json(result);
  } catch (err) { next(err); }
}

export async function getPostForReview(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await reviewsService.getPostForReview(param(req.params.postId));
    res.json({ data: post });
  } catch (err) { next(err); }
}

export async function submitReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { action, score, feedback } = reviewSchema.parse(req.body);
    // postId comes as :id from posts router, :postId from reviews router
    const postId = param(req.params.id ?? req.params.postId);
    await reviewsService.submitReview(req.user!.userId, postId, action, feedback, score);
    res.json({ message: 'Review submitted successfully' });
  } catch (err) { next(err); }
}
