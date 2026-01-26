export const REGEX = Object.freeze({
  adminPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
  phone: /^\+?[\d\s\-()]{10,15}$/,
});
