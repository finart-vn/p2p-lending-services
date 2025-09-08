// libs/common/constants/message-patterns.ts
export const MESSAGE_PATTERNS = {
  // Auth Service
  AUTH: {
    VALIDATE_TOKEN: 'auth.validate_token',
    REFRESH_TOKEN: 'auth.refresh_token',
    REVOKE_TOKEN: 'auth.revoke_token',
    LOGIN: 'auth.login',
    LOGOUT: 'auth.logout',
    REGISTER: 'auth.register',
    VERIFY_OTP: 'auth.verify_otp',
    RESET_PASSWORD: 'auth.reset_password',
  },

  // User Service
  USER: {
    CREATE: 'user.create',
    GET_BY_ID: 'user.get_by_id',
    GET_BY_EMAIL: 'user.get_by_email',
    UPDATE: 'user.update',
    DELETE: 'user.delete',
    LIST: 'user.list',
    VALIDATE_CREDENTIALS: 'user.validate_credentials',
    GET_PROFILE: 'user.get_profile',
    UPDATE_PROFILE: 'user.update_profile',
    VERIFY_IDENTITY: 'user.verify_identity',
    UPDATE_LOAN_STATUS: 'user.update_loan_status',
    GET_INVESTMENT_HISTORY: 'user.get_investment_history',
  },

  // Loan Service
  LOAN: {
    CREATE: 'loan.create',
    UPDATE: 'loan.update',
    APPROVE: 'loan.approve',
    REJECT: 'loan.reject',
    DISBURSE: 'loan.disburse',
    GET_BY_ID: 'loan.get_by_id',
    GET_BY_IDS: 'loan.get_by_ids',
    GET_BY_USER: 'loan.get_by_user',
    LIST: 'loan.list',
    CALCULATE_INTEREST: 'loan.calculate_interest',
    GET_MARKETPLACE: 'loan.get_marketplace',
    SEARCH_MARKETPLACE: 'loan.search_marketplace',
    GET_MARKETPLACE_FILTERS: 'loan.get_marketplace_filters',
    FUND: 'loan.fund',
    GET_ACTIVE: 'loan.get_active',
    DELETE: 'loan.delete',
  },

  // Investment Service
  INVESTMENT: {
    CREATE: 'investment.create',
    UPDATE: 'investment.update',
    CANCEL: 'investment.cancel',
    GET_BY_ID: 'investment.get_by_id',
    GET_BY_USER: 'investment.get_by_user',
    GET_BY_LOAN: 'investment.get_by_loan',
    GET_PORTFOLIO: 'investment.get_portfolio',
    CALCULATE_RETURNS: 'investment.calculate_returns',
  },

  // Payment Service
  PAYMENT: {
    PROCESS: 'payment.process',
    VERIFY: 'payment.verify',
    REFUND: 'payment.refund',
    GET_HISTORY: 'payment.get_history',
    VERIFY_TRANSACTION: 'payment.verify_transaction',
    SETUP_AUTO_PAYMENT: 'payment.setup_auto_payment',
    PROCESS_REPAYMENT: 'payment.process_repayment',
  },

  // Repayment Service
  REPAYMENT: {
    CREATE_SCHEDULE: 'repayment.create_schedule',
    PROCESS: 'repayment.process',
    GET_SCHEDULE: 'repayment.get_schedule',
    UPDATE_STATUS: 'repayment.update_status',
    CALCULATE_EMI: 'repayment.calculate_emi',
    HANDLE_DEFAULT: 'repayment.handle_default',
  },

  // Notification Service
  NOTIFICATION: {
    SEND_EMAIL: 'notification.send_email',
    SEND_SMS: 'notification.send_sms',
    SEND_PUSH: 'notification.send_push',
    LOAN_APPROVED: 'notification.loan_approved',
    LOAN_REJECTED: 'notification.loan_rejected',
    PAYMENT_DUE: 'notification.payment_due',
    PAYMENT_RECEIVED: 'notification.payment_received',
    INVESTMENT_OPPORTUNITY: 'notification.investment_opportunity',
  },

  // Report Service
  REPORT: {
    GENERATE_LOAN_REPORT: 'report.generate_loan_report',
    GENERATE_INVESTMENT_REPORT: 'report.generate_investment_report',
    GENERATE_USER_REPORT: 'report.generate_user_report',
    GENERATE_FINANCIAL_REPORT: 'report.generate_financial_report',
    LOAN_APPROVED: 'report.loan_approved',
    INVESTMENT_COMPLETED: 'report.investment_completed',
    SYSTEM_METRICS: 'report.system_metrics',
  },

  // Events (for pub/sub patterns)
  EVENTS: {
    USER_CREATED: 'user.created',
    USER_VERIFIED: 'user.verified',
    LOAN_CREATED: 'loan.created',
    LOAN_APPROVED: 'loan.approved',
    LOAN_REJECTED: 'loan.rejected',
    LOAN_FUNDED: 'loan.funded',
    INVESTMENT_CREATED: 'investment.created',
    INVESTMENT_COMPLETED: 'investment.completed',
    INVESTMENT_FAILED: 'investment.failed',
    PAYMENT_PROCESSED: 'payment.processed',
    PAYMENT_FAILED: 'payment.failed',
    REPAYMENT_DUE: 'repayment.due',
    REPAYMENT_COMPLETED: 'repayment.completed',
    SYSTEM_MAINTENANCE: 'system.maintenance',
    SYSTEM_QUEUE_FAILURE: 'system.queue_failure',
  },

  // Health checks
  HEALTH: {
    CHECK: 'health.check',
    PING: 'health.ping',
    STATUS: 'health.status',
  },
} as const;

// Enhanced type exports for better IDE support
export type MessagePattern = typeof MESSAGE_PATTERNS;
export type AuthPatterns = keyof typeof MESSAGE_PATTERNS.AUTH;
export type UserPatterns = keyof typeof MESSAGE_PATTERNS.USER;
export type LoanPatterns = keyof typeof MESSAGE_PATTERNS.LOAN;
export type InvestmentPatterns = keyof typeof MESSAGE_PATTERNS.INVESTMENT;
export type PaymentPatterns = keyof typeof MESSAGE_PATTERNS.PAYMENT;
export type RepaymentPatterns = keyof typeof MESSAGE_PATTERNS.REPAYMENT;
export type NotificationPatterns = keyof typeof MESSAGE_PATTERNS.NOTIFICATION;
export type ReportPatterns = keyof typeof MESSAGE_PATTERNS.REPORT;
export type EventPatterns = keyof typeof MESSAGE_PATTERNS.EVENTS;
export type HealthPatterns = keyof typeof MESSAGE_PATTERNS.HEALTH;

// Helper function to get all patterns for a service
export const getServicePatterns = (
  serviceName: keyof typeof MESSAGE_PATTERNS,
) => {
  return MESSAGE_PATTERNS[serviceName];
};

// Helper function to validate pattern
export const isValidPattern = (pattern: string): boolean => {
  const allPatterns: string[] = Object.values(MESSAGE_PATTERNS).flatMap(
    (service) => Object.values(service),
  );
  return allPatterns.includes(pattern);
};
