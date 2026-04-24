import axios from 'axios';

interface ApiErrorDetails {
  formErrors?: string[];
  fieldErrors?: Record<string, string[] | undefined>;
}

interface ApiErrorBody {
  error?: string;
  message?: string;
  details?: ApiErrorDetails;
}

function extractDetailsMessage(details?: ApiErrorDetails): string | undefined {
  if (!details) return undefined;

  const formMessage = details.formErrors?.find((msg) => typeof msg === 'string' && msg.trim().length > 0);
  if (formMessage) return formMessage;

  if (!details.fieldErrors) return undefined;

  for (const values of Object.values(details.fieldErrors)) {
    const first = values?.find((msg) => typeof msg === 'string' && msg.trim().length > 0);
    if (first) return first;
  }

  return undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | string | undefined;

    if (typeof data === 'string' && data.trim().length > 0) {
      return data;
    }

    if (data && typeof data === 'object') {
      const detailsMessage = extractDetailsMessage(data.details);
      if (detailsMessage) return detailsMessage;
      if (typeof data.error === 'string' && data.error.trim().length > 0) return data.error;
      if (typeof data.message === 'string' && data.message.trim().length > 0) return data.message;
    }

    const axiosMessage = error.message?.trim();
    if (axiosMessage) return axiosMessage;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}
