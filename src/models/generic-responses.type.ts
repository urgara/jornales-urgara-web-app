import { z } from 'zod/v4';

enum ErrorType {
  BAD_REQUEST = 'BAD_REQUEST', // 400 - Solicitud incorrecta.
  NOT_FOUND = 'NOT_FOUND', // 404 - Recurso no encontrado.
  UNAUTHORIZED = 'UNAUTHORIZED', // 401 - Falta de autenticación.
  FORBIDDEN = 'FORBIDDEN', // 403 - Autenticación correcta, pero sin permisos.
  DUPLICATE_ERROR = 'DUPLICATE_ERROR', // 409 - Conflicto por entrada duplicada. se usa en los servicios de creacion de datos, como create admin.
  DATABASE_ERROR = 'DATABASE_ERROR', // 500 - Error interno del servidor relacionado con la base de datos.
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT', // 409 - Conflicto de recurso, como intentos de actualizar algo que no permite múltiples cambios simultáneos.
  VALIDATION_ERROR = 'VALIDATION_ERROR', // 400 - Error en la validación de los datos proporcionados.
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR', // 500 - Error genérico del servidor.
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // 503 - El servicio no está disponible temporalmente.
  TOKEN_EXPIRED = 'TOKEN_EXPIRED', // 401 - El token de autenticación ha expirado.
  SECURITY_ALERT = 'SECURITY_ALERT', // 403 - Alerta de seguridad, como intento de acceso sospechoso.
  LOCALITY_ID_REQUIRED = 'LOCALITY_ID_REQUIRED', // 400 - El administrador debe especificar el parámetro localityId.
}

// Esquema base para respuestas
const ResponseGenericSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

const PaginationSchema = z.object({
  page: z.number().positive(),
  limit: z.number().positive(),
  total: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
});
// Esquema genérico para respuestas con datos
const ResponseGenericIncludeDataSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ResponseGenericSchema.extend({
    data: dataSchema,
  });

const ResponseGenericIncludeDataAndPaginationSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ResponseGenericSchema.extend({
    data: dataSchema,
    pagination: PaginationSchema,
  });

// Esquema para respuestas de error
const ErrorResponseSchema = z.object({
  success: z.literal(false),
  timestamp: z.string(),
  path: z.string(),
  method: z.string(),
  code: z.number(),
  message: z.string(),
  name: z.enum(ErrorType),
});

// Esquema para errores de validación
const ValidationErrorResponseSchema = ErrorResponseSchema.extend({
  errors: z.record(z.string(), z.array(z.string())),
});

type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
type ValidationErrorResponse = z.infer<typeof ValidationErrorResponseSchema>;

export {
  ResponseGenericSchema,
  ResponseGenericIncludeDataSchema,
  ResponseGenericIncludeDataAndPaginationSchema,
  ErrorResponseSchema,
  ValidationErrorResponseSchema,
  ErrorType,
};
export type { ErrorResponse, ValidationErrorResponse };
