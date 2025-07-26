graph TD

%% Borrower Features
subgraph Borrower
    B1[Loan Origination]
    B2[Loan Calculator]
    B3[Credit Score]
    B4[Document Scanner]
    B5[Auto-Payment]
    B6[Dashboard]
end

%% Lender Features
subgraph Lender
    L1[Loan Portfolio Management]
    L2[Loans Search]
    L3[Semi-Automated Investment]
end

%% Admin Features
subgraph Admin
    A1[User Management]
    A2[CRM]
    A3[Loan Management]
    A4[Finance Management]
    A5[Platform Analytics]
end

%% Optional: Connect Users to Roles (optional visualization)
User1(Borrower User)
User2(Lender User)
AdminUser(Admin)

User1 --> Borrower
User2 --> Lender
AdminUser --> Admin
