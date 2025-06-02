interface ServiceAPIResponse<T> {
  body: T | null;
  message: string;
  success: boolean;
}

interface ServiceAuthResponse<T> {
  body?: T | null;
  message: string;
  token?: string;
  success: boolean;
}


export { ServiceAPIResponse, ServiceAuthResponse };
