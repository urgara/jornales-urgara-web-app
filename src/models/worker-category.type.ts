import { z } from 'zod/v4';

/**
 * Worker Category Schema
 * Defines the two categories of workers: IDONEO and PERITO
 */
export const WorkerCategorySchema = z.enum(['IDONEO', 'PERITO']);

export type WorkerCategory = z.infer<typeof WorkerCategorySchema>;

/**
 * Category display options for forms
 */
export const WORKER_CATEGORY_OPTIONS = [
	{ value: 'IDONEO', label: 'Idóneo' },
	{ value: 'PERITO', label: 'Perito' },
] as const;

/**
 * Helper function to get the display label for a category
 */
export const getWorkerCategoryLabel = (category: WorkerCategory): string => {
	return category === 'IDONEO' ? 'Idóneo' : 'Perito';
};
