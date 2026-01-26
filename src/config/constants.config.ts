const IS_PROD = import.meta.env.PROD;
const DYNNAMIX_URL = IS_PROD ? import.meta.env.VITE_API : 'http://localhost:9000';

export { DYNNAMIX_URL };
