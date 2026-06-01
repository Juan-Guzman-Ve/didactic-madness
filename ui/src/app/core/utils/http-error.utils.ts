import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof HttpErrorResponse) {
    const apiMessage = error.error?.message;

    if (Array.isArray(apiMessage) && apiMessage.length > 0) {
      return apiMessage.join(' ');
    }

    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage;
    }

    if (typeof error.error === 'string' && error.error.trim().length > 0) {
      return error.error;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}
