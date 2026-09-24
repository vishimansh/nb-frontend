import { NOTIFICATION_CATEGORIES, getCategoryMeta } from './categories';

/**
 * The category tags that we use in podcasts are the exact same 
 * 10 categories of news that we have in our app.
 */
export const PODCAST_GENRES = NOTIFICATION_CATEGORIES;
export const PODCAST_CATEGORIES = NOTIFICATION_CATEGORIES;

export { getCategoryMeta };
export default NOTIFICATION_CATEGORIES;

