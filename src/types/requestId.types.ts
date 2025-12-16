import { Request } from 'express';

export const REQUEST_ID_HEADERS = [
  'x-request-id',
  'x-correlation-id',
  'request-id',
] as const;


export interface RequestIdOptions {
  headerName?: string;
  includeInResponse?: boolean;
  generator?: () => string;
  trustIncomingId?: boolean;
  maxIdLength?: number;
}

export const hasRequestId = (req: Request): req is Request & { requestId: string } => {
  return typeof req.requestId === 'string' && req.requestId.length > 0;
};
