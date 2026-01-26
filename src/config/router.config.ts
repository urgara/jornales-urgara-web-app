import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
// Import the generated route tree
export const router = createRouter({ routeTree, context: { admin: null, isAuth: false } });
