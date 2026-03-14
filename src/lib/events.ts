export const ANALYTICS_EVENTS = {
  loginSuccess: "auth_login_success",
  loginFailed: "auth_login_failed",
  logout: "auth_logout",
  sessionExpired: "auth_session_expired",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  data?: Record<string, string | number | boolean | null | undefined>;
}
