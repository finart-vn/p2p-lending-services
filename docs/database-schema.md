# P2P Lending Platform - Database Schema Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Database Tables](#database-tables)
- [Relationships](#relationships)
- [Business Rules](#business-rules)
- [Indexes & Performance](#indexes--performance)
- [Foreign Key Constraints](#foreign-key-constraints)
- [Implementation Notes](#implementation-notes)

---

## 📊 Overview

This database schema supports a comprehensive P2P (Peer-to-Peer) lending platform with the following core features:

- **User Management & Authentication**
- **KYC (Know Your Customer) Verification**
- **Credit Scoring System**
- **Loan Origination & Management**
- **Investment & Funding Flow**
- **Payment Processing & Repayment Tracking**
- **Notification System**
- **Analytics & Reporting**
- **Audit & Security Logging**

### 🎯 Supported Platform Phases
1. **Foundation**: Auth, Roles, CI/CD
2. **KYC Module**: Identity verification, document upload
3. **Loan System**: Credit scoring, loan requests
4. **Investment Flow**: Funding, marketplace
5. **Payment System**: Repayments, gateways
6. **Notifications**: Multi-channel alerts
7. **Dashboards**: Role-based interfaces
8. **Security**: RBAC, encryption, logging
9. **Analytics**: Reporting, data export

---

## 🗂️ Database Tables

### 👥 User Management

#### `users`
Core user information and authentication data.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Unique user identifier |
| `email` | varchar(255) | unique, not null | User's email address |
| `password_hash` | varchar(255) | not null | Encrypted password |
| `first_name` | varchar(100) | not null | User's first name |
| `last_name` | varchar(100) | not null | User's last name |
| `phone` | varchar(20) | | Phone number |
| `date_of_birth` | date | | Date of birth |
| `address` | text | | Full address |
| `city` | varchar(100) | | City |
| `country` | varchar(100) | | Country |
| `status` | enum | 'ACTIVE', 'SUSPENDED', 'INACTIVE' | Account status |
| `email_verified_at` | timestamp | | Email verification timestamp |
| `created_at` | timestamp | default now() | Account creation time |
| `updated_at` | timestamp | default now() | Last update time |

#### `roles`
System roles for access control.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | int | PK, auto_increment | Role identifier |
| `name` | varchar(50) | unique, not null | Role name (ADMIN, BORROWER, LENDER) |
| `description` | text | | Role description |
| `permissions` | json | | JSON array of permissions |
| `created_at` | timestamp | default now() | Creation time |

#### `user_roles`
Many-to-many relationship between users and roles.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `user_id` | bigint | PK, FK → users.id | User reference |
| `role_id` | int | PK, FK → roles.id | Role reference |
| `assigned_at` | timestamp | default now() | Assignment time |
| `assigned_by` | bigint | FK → users.id | Admin who assigned role |

---

### 🔍 KYC & Verification

#### `kyc`
Know Your Customer verification data.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | KYC record ID |
| `user_id` | bigint | FK → users.id, unique | User reference |
| `id_number` | varchar(50) | unique | Government ID number |
| `id_type` | enum | 'PASSPORT', 'ID_CARD', 'DRIVER_LICENSE' | ID document type |
| `employment_status` | enum | 'EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED' | Employment status |
| `monthly_income` | decimal(15,2) | | Monthly income amount |
| `employer_name` | varchar(255) | | Employer company name |
| `status` | enum | 'PENDING', 'VERIFIED', 'REJECTED' | Verification status |
| `verified_at` | timestamp | | Verification completion time |
| `verified_by` | bigint | FK → users.id | Admin who verified |
| `rejection_reason` | text | | Reason for rejection |
| `created_at` | timestamp | default now() | Submission time |
| `updated_at` | timestamp | default now() | Last update time |

#### `documents`
Uploaded verification documents.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Document ID |
| `user_id` | bigint | FK → users.id | User who uploaded |
| `document_type` | enum | 'ID_FRONT', 'ID_BACK', 'INCOME_PROOF', 'BANK_STATEMENT' | Document category |
| `file_name` | varchar(255) | | Original filename |
| `file_path` | varchar(500) | | Storage path |
| `file_size` | bigint | | File size in bytes |
| `mime_type` | varchar(100) | | File MIME type |
| `is_encrypted` | boolean | default true | Encryption flag |
| `uploaded_at` | timestamp | default now() | Upload time |

---

### 💰 Credit & Loans

#### `credit_scores`
Credit scoring and risk assessment.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Score record ID |
| `user_id` | bigint | FK → users.id, unique | User reference |
| `score` | int | check (0-100) | Overall credit score |
| `grade` | enum | 'A', 'B', 'C', 'D', 'E' | Credit grade |
| `employment_score` | int | | Employment factor score |
| `income_score` | int | | Income factor score |
| `history_score` | int | | History factor score |
| `debt_to_income_ratio` | decimal(5,2) | | DTI ratio percentage |
| `calculated_at` | timestamp | default now() | Calculation time |
| `expires_at` | timestamp | | Score expiry (90 days) |

#### `loans`
Loan requests and management.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Loan ID |
| `borrower_id` | bigint | FK → users.id | Borrower reference |
| `loan_number` | varchar(50) | unique | Unique loan identifier |
| `requested_amount` | decimal(15,2) | | Requested loan amount |
| `funded_amount` | decimal(15,2) | default 0 | Currently funded amount |
| `interest_rate` | decimal(5,2) | | Annual interest rate |
| `term_months` | int | | Loan term in months |
| `monthly_payment` | decimal(15,2) | | Calculated monthly payment |
| `purpose` | enum | 'PERSONAL', 'BUSINESS', 'EDUCATION', 'HOME_IMPROVEMENT', 'DEBT_CONSOLIDATION' | Loan purpose |
| `description` | text | | Loan description |
| `status` | enum | 'DRAFT', 'PENDING', 'APPROVED', 'LISTED', 'FUNDING', 'ACTIVE', 'COMPLETED', 'DEFAULTED', 'REJECTED' | Loan status |
| `listing_date` | timestamp | | Date listed for funding |
| `funding_deadline` | timestamp | | Funding deadline |
| `disbursed_at` | timestamp | | Disbursement time |
| `created_at` | timestamp | default now() | Creation time |
| `updated_at` | timestamp | default now() | Last update time |

---

### 📈 Investments

#### `investments`
Lender investments in loans.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Investment ID |
| `lender_id` | bigint | FK → users.id | Lender reference |
| `loan_id` | bigint | FK → loans.id | Loan reference |
| `amount` | decimal(15,2) | | Investment amount |
| `percentage` | decimal(5,2) | | Percentage of loan funded |
| `expected_return` | decimal(15,2) | | Expected total return |
| `total_received` | decimal(15,2) | default 0 | Amount received so far |
| `status` | enum | 'PENDING', 'ACTIVE', 'COMPLETED', 'DEFAULTED' | Investment status |
| `invested_at` | timestamp | default now() | Investment time |
| `completed_at` | timestamp | | Completion time |

#### `investment_returns`
Distribution of returns to investors.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Return record ID |
| `investment_id` | bigint | FK → investments.id | Investment reference |
| `payment_id` | bigint | FK → payments.id | Payment that generated return |
| `principal_amount` | decimal(15,2) | | Principal portion |
| `interest_amount` | decimal(15,2) | | Interest portion |
| `total_amount` | decimal(15,2) | | Total return amount |
| `received_at` | timestamp | default now() | Distribution time |

---

### 💳 Payments & Repayments

#### `repayment_schedules`
Scheduled loan repayments.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Schedule ID |
| `loan_id` | bigint | FK → loans.id | Loan reference |
| `installment_number` | int | | Installment sequence number |
| `due_date` | date | | Payment due date |
| `principal_amount` | decimal(15,2) | | Principal portion |
| `interest_amount` | decimal(15,2) | | Interest portion |
| `total_amount` | decimal(15,2) | | Total payment amount |
| `status` | enum | 'PENDING', 'PAID', 'LATE', 'DEFAULTED' | Payment status |
| `paid_at` | timestamp | | Actual payment time |
| `created_at` | timestamp | default now() | Schedule creation time |

#### `payments`
Actual payment transactions.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Payment ID |
| `loan_id` | bigint | FK → loans.id | Loan reference |
| `schedule_id` | bigint | FK → repayment_schedules.id | Schedule reference |
| `payer_id` | bigint | FK → users.id | User making payment |
| `payment_reference` | varchar(100) | unique | Payment reference number |
| `amount` | decimal(15,2) | | Payment amount |
| `payment_method` | enum | 'BANK_TRANSFER', 'VNPAY', 'MOMO', 'STRIPE', 'MANUAL' | Payment method |
| `gateway_transaction_id` | varchar(255) | | Gateway transaction ID |
| `status` | enum | 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED' | Payment status |
| `late_fee` | decimal(15,2) | default 0 | Late payment fee |
| `processed_at` | timestamp | | Processing time |
| `created_at` | timestamp | default now() | Creation time |

---

### 📢 Communications & System

#### `notifications`
Multi-channel notification system.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Notification ID |
| `user_id` | bigint | FK → users.id | Target user |
| `type` | enum | 'EMAIL', 'SMS', 'IN_APP', 'PUSH' | Notification channel |
| `category` | enum | 'KYC', 'LOAN', 'PAYMENT', 'INVESTMENT', 'SECURITY' | Notification category |
| `title` | varchar(255) | | Notification title |
| `message` | text | | Notification content |
| `status` | enum | 'PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED' | Delivery status |
| `priority` | enum | 'LOW', 'MEDIUM', 'HIGH', 'URGENT' | Priority level |
| `related_entity_type` | varchar(50) | | Related entity type |
| `related_entity_id` | bigint | | Related entity ID |
| `scheduled_at` | timestamp | | Scheduled send time |
| `sent_at` | timestamp | | Actual send time |
| `read_at` | timestamp | | Read time |
| `created_at` | timestamp | default now() | Creation time |

#### `activity_logs`
Audit trail and security logging.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Log entry ID |
| `user_id` | bigint | FK → users.id | User who performed action |
| `action` | varchar(100) | | Action performed |
| `entity_type` | varchar(50) | | Entity type affected |
| `entity_id` | bigint | | Entity ID affected |
| `ip_address` | varchar(45) | | User's IP address |
| `user_agent` | text | | Browser/client info |
| `old_values` | json | | Previous values |
| `new_values` | json | | New values |
| `created_at` | timestamp | default now() | Action time |

#### `analytics_reports`
Generated reports and analytics.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | bigint | PK, auto_increment | Report ID |
| `generated_by` | bigint | FK → users.id | User who generated |
| `report_type` | enum | 'USER_ACTIVITY', 'LOAN_PERFORMANCE', 'INVESTMENT_RETURNS', 'PLATFORM_STATS' | Report category |
| `title` | varchar(255) | | Report title |
| `filters` | json | | Applied filters |
| `data` | json | | Report data |
| `file_path` | varchar(500) | | Generated file path |
| `format` | enum | 'PDF', 'CSV', 'EXCEL', 'JSON' | Export format |
| `period_start` | date | | Report period start |
| `period_end` | date | | Report period end |
| `generated_at` | timestamp | default now() | Generation time |
| `expires_at` | timestamp | | File expiry time |

#### `platform_settings`
Configurable platform parameters.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | int | PK, auto_increment | Setting ID |
| `key` | varchar(100) | unique | Setting key |
| `value` | text | | Setting value |
| `type` | enum | 'STRING', 'NUMBER', 'BOOLEAN', 'JSON' | Value type |
| `description` | text | | Setting description |
| `is_public` | boolean | default false | Public visibility |
| `updated_by` | bigint | FK → users.id | Last updater |
| `updated_at` | timestamp | default now() | Update time |

---

## 🔗 Relationships

### Core Relationships
- **Users ↔ Roles**: Many-to-many via `user_roles`
- **Users → KYC**: One-to-one relationship
- **Users → Documents**: One-to-many
- **Users → Credit Scores**: One-to-one
- **Users → Loans (as Borrower)**: One-to-many
- **Users → Investments (as Lender)**: One-to-many

### Loan & Investment Flow
- **Loans → Investments**: One-to-many (multiple investors per loan)
- **Loans → Repayment Schedules**: One-to-many
- **Loans → Payments**: One-to-many
- **Repayment Schedules → Payments**: One-to-many (optional)

### Payment & Returns Flow
- **Investments → Investment Returns**: One-to-many
- **Payments → Investment Returns**: One-to-many
- **Users → Payments (as Payer)**: One-to-many

### System Relationships
- **Users → Notifications**: One-to-many
- **Users → Activity Logs**: One-to-many
- **Users → Analytics Reports**: One-to-many

---

## 📏 Business Rules

### 🔐 KYC & Verification
1. **Users must complete KYC before creating loans**
2. **Document encryption is mandatory** for sensitive files
3. **KYC verification requires admin approval**
4. **ID numbers must be unique** across the platform

### 💰 Credit & Lending
1. **Credit scores expire after 90 days** and require recalculation
2. **Loans require admin approval** before listing for funding
3. **Credit grades are auto-assigned** based on score ranges:
   - A: 81-100
   - B: 61-80
   - C: 41-60
   - D: 21-40
   - E: 0-20

### 📈 Investment & Funding
1. **Total investments cannot exceed loan amount**
2. **Investment returns distributed proportionally** based on investment percentage
3. **Minimum funding threshold** must be met before loan activation
4. **Funding deadline enforcement** - unfunded loans return to draft

### 💳 Payments & Repayments
1. **Repayment schedules auto-generated** on loan approval
2. **Late fees calculated after 7-day grace period**
3. **Payment gateway integration** supports multiple providers
4. **Failed payments trigger notification** cascade

### 🔔 Notifications & Security
1. **Multi-channel notification delivery** with fallback options
2. **Priority-based notification queuing**
3. **Activity logging for all sensitive operations**
4. **Data encryption for PII** and financial information

---

## ⚡ Indexes & Performance

### 🎯 Primary Indexes
```sql
-- Users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- KYC table
CREATE INDEX idx_kyc_user_id ON kyc(user_id);
CREATE INDEX idx_kyc_status ON kyc(status);

-- Credit Scores
CREATE INDEX idx_credit_scores_user_id ON credit_scores(user_id);
CREATE INDEX idx_credit_scores_calculated_at ON credit_scores(calculated_at);

-- Loans
CREATE INDEX idx_loans_borrower_id ON loans(borrower_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_listing_date ON loans(listing_date);

-- Investments
CREATE INDEX idx_investments_lender_id ON investments(lender_id);
CREATE INDEX idx_investments_loan_id ON investments(loan_id);
CREATE INDEX idx_investments_status ON investments(status);

-- Repayment Schedules
CREATE INDEX idx_repayment_schedules_loan_id ON repayment_schedules(loan_id);
CREATE INDEX idx_repayment_schedules_due_date ON repayment_schedules(due_date);
CREATE INDEX idx_repayment_schedules_status ON repayment_schedules(status);

-- Payments
CREATE INDEX idx_payments_loan_id ON payments(loan_id);
CREATE INDEX idx_payments_schedule_id ON payments(schedule_id);
CREATE INDEX idx_payments_payer_id ON payments(payer_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Activity Logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Analytics Reports
CREATE INDEX idx_analytics_reports_generated_by ON analytics_reports(generated_by);
CREATE INDEX idx_analytics_reports_type ON analytics_reports(report_type);
CREATE INDEX idx_analytics_reports_generated_at ON analytics_reports(generated_at);
```

### 📊 Composite Indexes
```sql
-- Query optimization for common patterns
CREATE INDEX idx_loans_status_listing_date ON loans(status, listing_date);
CREATE INDEX idx_payments_loan_status ON payments(loan_id, status);
CREATE INDEX idx_investments_lender_status ON investments(lender_id, status);
CREATE INDEX idx_notifications_user_status_created ON notifications(user_id, status, created_at);
```

---

## 🔒 Foreign Key Constraints

### 🛡️ Constraint Policy
- **CASCADE on UPDATE**: All foreign key relationships
- **RESTRICT on DELETE**: Most relationships to prevent data loss
- **CASCADE on DELETE**: Only for cleanup tables (`user_roles`, `investment_returns`)

### 📋 Key Constraints
```sql
-- User relationships
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_role 
    FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- KYC relationships
ALTER TABLE kyc ADD CONSTRAINT fk_kyc_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE kyc ADD CONSTRAINT fk_kyc_verified_by 
    FOREIGN KEY (verified_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Document relationships
ALTER TABLE documents ADD CONSTRAINT fk_documents_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Loan relationships
ALTER TABLE loans ADD CONSTRAINT fk_loans_borrower 
    FOREIGN KEY (borrower_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Investment relationships
ALTER TABLE investments ADD CONSTRAINT fk_investments_lender 
    FOREIGN KEY (lender_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE investments ADD CONSTRAINT fk_investments_loan 
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Payment relationships
ALTER TABLE payments ADD CONSTRAINT fk_payments_loan 
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE payments ADD CONSTRAINT fk_payments_schedule 
    FOREIGN KEY (schedule_id) REFERENCES repayment_schedules(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- Investment returns (cascade delete for cleanup)
ALTER TABLE investment_returns ADD CONSTRAINT fk_investment_returns_investment 
    FOREIGN KEY (investment_id) REFERENCES investments(id) ON UPDATE CASCADE ON DELETE CASCADE;
```

---

## 🚀 Implementation Notes

### 🏗️ Database Setup
1. **MySQL 8.0+** or **PostgreSQL 12+** recommended
2. **UTF8MB4** character set for full Unicode support
3. **InnoDB** storage engine for ACID compliance
4. **Connection pooling** for high concurrency

### 🔐 Security Considerations
1. **Encrypt sensitive columns** (password_hash, documents)
2. **Use parameterized queries** to prevent SQL injection
3. **Implement row-level security** for multi-tenant data
4. **Regular security audits** and penetration testing

### 📈 Scalability Strategies
1. **Read replicas** for analytics and reporting
2. **Horizontal partitioning** for large tables (payments, activity_logs)
3. **Archive old data** with retention policies
4. **Cache frequently accessed data** (credit scores, user profiles)

### 🔄 Data Migration
1. **Version-controlled migrations** for schema changes
2. **Backup strategy** with point-in-time recovery
3. **Blue-green deployment** for zero-downtime updates
4. **Data integrity checks** post-migration

### 📊 Monitoring & Maintenance
1. **Query performance monitoring** with slow query logs
2. **Index usage analysis** and optimization
3. **Storage growth monitoring** and cleanup procedures
4. **Automated backup verification** and testing

---

## 📚 Related Documentation
- [API Documentation](./api-documentation.md)
- [Business Logic Flows](./business-flows.md)
- [Security Guidelines](./security-guidelines.md)
- [Deployment Guide](./deployment-guide.md)

---

*Last Updated: December 2024*
*Schema Version: 1.0* 