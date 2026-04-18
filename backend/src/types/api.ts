export interface ApiResponse<T> {
  data: T;
}

export function success<T>(data: T): ApiResponse<T> {
  return { data };
}
