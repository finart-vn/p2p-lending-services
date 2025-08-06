enum RmqService {
  AUTH = 'AUTH_SERVICE',
  USER = 'USER_SERVICE',
  LOAN = 'LOAN_SERVICE',
  INVESTMENT = 'INVESTMENT_SERVICE',
  REPAYMENT = 'REPAYMENT_SERVICE',
  NOTIFICATION = 'NOTIFICATION_SERVICE',
  PAYMENT = 'PAYMENT_SERVICE',
  REPORT = 'REPORT_SERVICE',
}
enum RmqQueue {
  AUTH = 'auth_queue',
  USER = 'user_queue',
  LOAN = 'loan_queue',
  INVESTMENT = 'investment_queue',
  REPAYMENT = 'repayment_queue',
  NOTIFICATION = 'notification_queue',
  PAYMENT = 'payment_queue',
  REPORT = 'report_queue',
}

export { RmqQueue, RmqService };
