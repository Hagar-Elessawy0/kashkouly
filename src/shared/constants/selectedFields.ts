// User
export const USER_EXCLUDED_FIELDS = [
  '-password',
  '-refreshToken',
  '-passwordReset',
  '-tokenVersion',
  '__v',
] as const;

export const USER_SELECTED_FIELDS = [
  'name',
  'email',
  'isEmailVerified',
  'avatar'
] as const;