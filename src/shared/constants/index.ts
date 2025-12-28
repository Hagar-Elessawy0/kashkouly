export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_COURSES: 'manage_courses',
  VIEW_REPORTS: 'view_reports',
  MANAGE_INSTRUCTORS: 'manage_instructors',
  MANAGE_ADMINS: 'manage_admins',
  IT_SUPPORT: 'it_support',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
