interface UmamiApi {
  identify: (data: Record<string, string>) => void;
  track: (
    name: string,
    data?: Record<string, string | number | boolean | null | undefined>,
  ) => Promise<void> | void;
}

interface Window {
  umami?: UmamiApi;
}
