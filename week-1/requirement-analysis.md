# Requirement Analysis Document
## B2B Vendor Invoice Management Portal

> **Document Type:** Requirement Analysis — Pre-Development QA Analysis
> **Version:** 1.0 — Draft
> **Date:** June 2026
> **Status:** Pending Client Clarification and Sign-Off

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Requirement Understanding](#2-requirement-understanding)
3. [Ambiguous Requirements](#3-ambiguous-requirements)
4. [Client Clarification Questions](#4-client-clarification-questions)
5. [Assumptions](#5-assumptions)
6. [Edge Cases](#6-edge-cases)
7. [Risks](#7-risks)
8. [Open Items](#8-open-items)

---

## 1. Project Overview

### 1.1 Purpose

The Vendor Invoice Management Portal is a B2B web platform that digitizes the invoice lifecycle between external vendors and the internal Accounts Payable (AP) team. It replaces manual invoice handling with a centralized, role-controlled workflow.

### 1.2 Business Objectives

- Allow vendors to self-register and submit invoices.
- Enable the AP team to review, approve, or reject invoices against validated purchase orders (POs).
- Auto-forward approved invoices to payment processing.
- Send real-time email notifications on invoice status changes.
- Generate monthly invoice activity reports.
- Restrict system access to authorized users only.

### 1.3 User Roles

| Role | Responsibilities | Access Scope |
|---|---|---|
| **Vendor** | Register, log in, submit invoices, track status | Own invoices only |
| **AP Team Member** | View, approve, reject invoices; access reports | All vendor invoices (scope TBD) |
| **System Admin** *(assumed)* | User management, audit logs, system config | Full access (TBD) |

### 1.4 High-Level Workflow

1. Vendor registers and logs in.
2. Vendor submits an invoice linked to a valid PO.
3. AP team is notified and reviews the invoice.
4. AP team approves or rejects the invoice (with reason).
5. Both parties receive email notifications on status change.
6. Approved invoices are forwarded to payment processing.
7. System generates a monthly invoice activity report.

---

## 2. Requirement Understanding

| # | Requirement | Module | Interpretation |
|---|---|---|---|
| R1 | Vendors can register and log in | Registration / Authentication | Self-registration form with credential validation. Implies password policy and secure session management. |
| R2 | Vendors can submit invoices against POs | Invoice Submission | Create invoice, link to valid PO(s), and attach documents. File format and size limits are not stated. |
| R3 | AP team can view, approve, or reject invoices | Approval Workflow | AP dashboard with approve/reject capability. Mandatory comment requirement is not defined. |
| R4 | Approved invoices forwarded for payment | Payment Integration | Automatic hand-off to payment system on approval. Integration method is not defined. |
| R5 | Both parties receive email notifications | Notifications | Emails triggered on invoice status changes. Exact trigger points and email content are not defined. |
| R6 | System generates monthly invoice reports | Reporting | Scheduled or on-demand report. Content, format, and access level are not defined. |
| R7 | Only authorized users can access the system | Security & Access Control | RBAC required. Role-permission matrix is not defined. |

---

## 3. Ambiguous Requirements

### AMB-01 — Vendor Registration | Req: R1
No mention of whether registration requires admin approval or is self-approved.

---

### AMB-02 — Vendor Registration | Req: R1
Email verification after sign-up is not mentioned.

---

### AMB-03 — Invoice Submission | Req: R2
No definition of which PO states are valid for invoice submission (open, closed, cancelled).

---

### AMB-04 — Invoice Submission | Req: R2
No definition of whether one invoice can be linked to multiple POs, or multiple invoices can be submitted against the same PO.

---

### AMB-05 — Invoice Submission | Req: R2
File format restrictions, size limits, and attachment rules for invoice documents are not stated.

---

### AMB-06 — Approval Workflow | Req: R3
Approval is not described as single-level or multi-level.

---

### AMB-07 — Approval Workflow | Req: R3
No definition of whether approval comments or rejection reasons are mandatory.

---

### AMB-08 — Approval Workflow | Req: R3
No definition of whether an approved invoice can be reverted to a previous status.

---

### AMB-09 — Invoice Modification | Req: Implied
No statement on whether vendors can edit invoices after submission, after rejection, or after approval.

---

### AMB-10 — Invoice Assignment | Req: Implied
No definition of how invoices are routed or assigned to AP team members.

---

### AMB-11 — Payment Processing | Req: R4
Payment processing integration method is not defined (API, file transfer, manual trigger).

---

### AMB-12 — Payment Processing | Req: R4
No mention of payment failure handling or retry logic.

---

### AMB-13 — Payment Dispute | Req: Implied
No mention of a dispute or query mechanism for vendors after an invoice reaches Paid status.

---

### AMB-14 — Invoice Status Lifecycle | Req: R3, R4, R5
Complete invoice status list is not defined (Draft, Submitted, Pending, Approved, Rejected, Paid, etc.).

---

### AMB-15 — Notifications | Req: R5
No definition of when notifications are sent or what the email content should include.

---

### AMB-16 — Reporting | Req: R6
No definition of report content, format (PDF/Excel/screen), access roles, or delivery method.

---

### AMB-17 — Security & Access Control | Req: R7
"Authorized users" is not defined. No role-permission matrix is provided.

---

### AMB-18 — Duplicate Invoice Handling | Req: Implied
No rule defined for what constitutes a duplicate invoice.

---

### AMB-19 — Audit & Tracking | Req: Implied
No mention of audit trail requirements — what actions are logged and by whom.

---

### AMB-20 — Partial Invoice Amount | Req: R2
No definition of whether a vendor can submit an invoice for a partial amount against a PO (e.g., PO value is 50,000 but invoice is submitted for 20,000), or whether the full PO amount must be invoiced in a single submission.

---

## 4. Client Clarification Questions

### Module: Registration

1. Is vendor registration self-approved, or does it require admin/AP team approval before access is granted?
2. Is email verification required immediately after registration?
3. What mandatory fields are required during vendor registration (company name, tax ID, bank details, contact person, etc.)?
4. Can vendor profile details be edited after registration? If yes, who can edit them?
5. Can vendor accounts be disabled? What happens to pending invoices when a vendor is disabled?

---

### Module: Authentication / Login

1. What authentication mechanism is used (username/password, SSO, OAuth, MFA)?
2. Is a "forgot password" or password reset flow required?
3. Is there a session timeout or account lockout policy after failed login attempts?

---

### Module: Invoice Upload

1. Can a single invoice have multiple attachments (e.g., invoice PDF + supporting documents)?
2. What file formats are accepted (PDF, XLSX, JPEG, PNG)?
3. What is the maximum file size per attachment? Is there a total upload size limit per invoice?
4. Is a file attachment mandatory, or can an invoice be submitted with form data only?

---

### Module: Invoice Validation

1. Are invoices validated manually by the AP team only, or does the system perform automated field-level validation on submission?
2. If automated, which fields are validated (invoice number format, amount range, PO number existence)?
3. Must the invoice amount match the PO amount exactly, or can it be a partial amount?
4. Must the invoice number be unique per vendor, globally, or per PO?
5. What happens when validation fails at submission — is the invoice saved as Draft or fully rejected?

---

### Module: Purchase Order Mapping

1. Can a single invoice be mapped to multiple POs?
2. Can multiple invoices be submitted against the same PO (partial billing)?
3. What defines a valid PO — is there a PO master list in the system, or do vendors enter PO numbers manually?
4. Can an invoice be submitted against a closed, cancelled, or fully consumed PO?

---

### Module: Approval Workflow

1. Is approval single-level (one AP approver) or multi-level (e.g., AP Clerk then Finance Manager)?
2. Who has approval privileges — all AP members, or a specific role?
3. Is an approval or rejection comment/reason mandatory?
4. Can an approved invoice be moved back to Pending or Rejected? If yes, by whom and under what conditions?
5. What conditions must be met before an invoice can be approved?
6. What happens if two AP members attempt to approve/reject the same invoice simultaneously?

---

### Module: Invoice Modification

1. Can a vendor modify an invoice after it has been submitted?
2. Can a vendor edit an invoice after it has been rejected?
3. Can a vendor resubmit a rejected invoice after making corrections?
4. Can an invoice be modified after approval?
5. When an invoice is edited, is a new version created or is the existing record overwritten?

---

### Module: Invoice Assignment Workflow

1. Are invoices automatically assigned to a specific AP team member, or do members pick from a shared queue?
2. Can invoices be reassigned from one AP member to another?
3. Is there an SLA for how long an AP member has to act on an assigned invoice?
4. Are vendors notified when their invoice is assigned to a specific AP member?

---

### Module: Payment Processing

1. Is payment triggered automatically on approval, or does a finance team member initiate it manually?
2. What is the integration method with the payment system: REST API, file transfer (CSV/XML), webhook, or third-party gateway?
3. How is payment failure communicated and retried?
4. Is invoice status updated to "Paid" automatically or manually after payment?
5. What fields does the payment system require from the invoice (bank account, amount, currency, etc.)?

---

### Module: Payment Dispute Management

1. Can vendors raise a payment dispute after an invoice reaches Paid status?
2. Is there a "Raise Query" or "Contact AP Team" feature in the portal?
3. Can vendors attach documents when raising a dispute?
4. Who handles disputes — AP team, finance team, or a dedicated handler?
5. What statuses does a dispute have (Open, In Review, Resolved, Closed)?
6. Are notifications sent when dispute status changes?

---

### Module: Notifications

1. On which status transitions are email notifications sent (Submitted, Approved, Rejected, Paid, Dispute Raised)?
2. Are AP team members notified by email, in-app notification, or both when a new invoice is submitted?
3. What information should the notification email include (invoice number, amount, status, portal link)?
4. What happens when an email notification fails to deliver?
5. Are notification preferences configurable by users (opt-in/opt-out per event)?

---

### Module: Reporting

1. What does "monthly invoice activity" include — totals, amounts, statuses, vendor-wise or PO-wise breakdown?
2. Is the report displayed on a portal dashboard, sent via email, or both?
3. What export formats are supported: PDF, Excel, CSV?
4. Who can view and download reports — all AP members, admins only, or also vendors (their own data)?
5. Is the report auto-generated on a schedule (e.g., 1st of each month) or available on-demand?
6. Can custom date ranges be used for ad hoc reports?

---

### Module: Security & Access Control

1. What is the full role list (Vendor, AP Clerk, AP Manager, Finance, System Admin)?
2. Can vendors see invoices submitted by other vendors?
3. Can an AP team member see all invoices or only those assigned to them?
4. Is there a role-permission matrix (feature-level access per role)?
5. Are failed login attempts logged and is account lockout enforced?
6. Is data encrypted in transit (TLS) and at rest?
7. Is there IP whitelisting or geographic access restriction for AP team access?

---

### Module: Audit & Tracking

1. Does the system maintain an audit trail for every action on an invoice (submitted, modified, approved, rejected, paid)?
2. Is the audit trail visible to AP team members, or only to admins?
3. Are AP team login and logout events logged?
4. How long is audit data retained?
5. Must the audit trail be exportable for compliance purposes?

---

## 5. Assumptions

> The following are working assumptions made during analysis where requirements are not confirmed. All must be validated with the client before test design begins.

1. Email verification is required immediately after vendor registration before the account is activated.
2. Vendor registration is self-service; no admin pre-approval is required.
3. Each invoice must be linked to at least one valid, open PO.
4. Invoice amount may be less than or equal to the PO amount (partial billing is allowed).
5. Invoice number must be unique per vendor.
6. Approval is single-level: one AP team member approves or rejects.
7. Approval and rejection comments/reasons are mandatory.
8. Vendors cannot modify an invoice after submission unless it is in Rejected status.
9. Once an invoice is approved, it cannot be reversed.
10. Payment system integration is via REST API.
11. Email notifications are sent to both the vendor and AP team on every invoice status change.
12. The monthly report is auto-generated on the 1st of each month and is accessible to AP team members only.
13. Vendors can only view their own invoices.
14. The system maintains an audit log for all invoice actions.
15. Supported file formats are PDF and JPEG only, with a 10MB maximum per file.
16. A System Admin role exists with full access to user management and audit data.

---

## 6. Edge Cases

### Module: Registration & Authentication

- Vendor registers with an already-registered email address.
- Vendor submits registration with all mandatory fields missing.
- Vendor registers but never verifies email, then attempts to log in.
- Vendor enters wrong password 5 or more consecutive times.
- Password reset link is used more than once or after it expires.
- Two users register simultaneously with the same email address (race condition).

---

### Module: Invoice Submission & Upload

- Vendor submits an invoice with no file attachment (if attachments are mandatory).
- Vendor uploads a file with an unsupported format (e.g., .exe, .zip, .docx).
- Vendor uploads a corrupted or zero-byte file.
- Vendor uploads a file exceeding the maximum allowed size.
- Vendor submits the identical invoice document twice in succession.
- Vendor submits an invoice with the same invoice number twice.
- Vendor submits an invoice with a blank or invalid invoice number.
- Vendor submits an invoice with a future date or a date before the PO creation date.
- Vendor submits an invoice while network connectivity drops mid-upload.

---

### Module: Purchase Order Mapping

- Vendor enters a PO number that does not exist in the system.
- Vendor submits an invoice against a PO already fully consumed by prior invoices.
- Vendor submits an invoice against a closed or cancelled PO.
- Invoice amount exceeds the remaining PO balance.
- Vendor maps the same invoice to a PO already associated with a paid invoice.

---

### Module: Approval Workflow

- Two AP team members attempt to approve the same invoice simultaneously.
- AP team member attempts to approve an invoice already approved by another.
- AP team member attempts to approve an invoice with missing mandatory fields.
- AP team member rejects an invoice without providing a reason (if reason is mandatory).
- Vendor account is disabled while their invoice is in Pending Approval status.
- Invoice is approved after a long delay (e.g., 30+ days after submission).

---

### Module: Invoice Modification

- Vendor attempts to edit an invoice already in Approved status.
- Vendor attempts to edit an invoice in Paid status.
- Vendor edits and resubmits a rejected invoice with no changes made.
- Vendor modifies the invoice amount to exceed the PO amount.
- Concurrent modification: vendor edits invoice while AP team is reviewing it.

---

### Module: Payment Processing

- Payment API call fails due to external system timeout.
- Payment is initiated but vendor's bank account details are invalid.
- Invoice is approved but not forwarded to payment due to a system error.
- Same invoice is forwarded to payment processing twice (duplicate payment risk).
- Vendor re-uploads the same invoice after it has already been paid.

---

### Module: Notifications

- Email notification fails to deliver (invalid address, mail server down).
- Bulk status changes trigger mass email notifications simultaneously.
- Vendor changes their registered email while a notification is pending delivery.
- Notification is triggered but the invoice record is deleted before the email is sent.

---

### Module: Reporting

- No invoices exist for the reporting period; report generated with zero records.
- Report generation is triggered while a large batch of invoices is being processed.
- User attempts to access a report for a future month.
- Multiple users download the same report concurrently.

---

### Module: Security & Access Control

- Vendor attempts to access another vendor's invoice via direct URL manipulation.
- AP team member attempts to access admin-only pages without the admin role.
- Unauthenticated user attempts to access invoice pages directly via URL.
- Session token expires mid-action during invoice submission.
- SQL injection or XSS attempted in form input fields (invoice number, description, etc.).

---

## 7. Risks

### 7.1 Functional Risks

| Risk | Severity | Description |
|---|---|---|
| Undefined approval workflow | HIGH | Approval level, routing, and reversal logic are unclear. Incorrect implementation could allow invalid invoices to reach payment. |
| No invoice modification policy | HIGH | Without editing rules, vendors may alter invoices after AP review begins. |
| No duplicate invoice detection | HIGH | The same invoice may be submitted and paid multiple times. |
| Incomplete invoice status lifecycle | MEDIUM | An undefined status model leads to incorrect notification triggers and inaccurate reports. |
| Undefined PO validation logic | HIGH | Invoices against invalid or over-consumed POs could cause financial liability. |

---

### 7.2 Business Risks

| Risk | Severity | Description |
|---|---|---|
| Duplicate payment | CRITICAL | Without deduplication and payment confirmation, the same invoice could be paid twice. |
| Vendor onboarding delays | MEDIUM | Slow admin-approval process could block vendors from submitting invoices. |
| Inaccurate reports | MEDIUM | If the monthly report misses invoice states or partial PO usage, business decisions will be based on incorrect data. |
| No dispute resolution channel | MEDIUM | Vendors have no in-portal way to raise payment issues, creating external escalations. |

---

### 7.3 Security Risks

| Risk | Severity | Description |
|---|---|---|
| Unauthorized invoice access | HIGH | Without strict role enforcement, vendors may access or modify each other's invoices. |
| Missing audit trail | HIGH | No audit trail makes fraud investigation, compliance, and dispute resolution impossible. |
| Authentication vulnerabilities | HIGH | No MFA, lockout, or brute force protection exposes the portal to credential attacks. |
| URL manipulation / data exposure | MEDIUM | Without server-side authorization, invoice IDs in URLs could expose records to unauthorized users. |

---

### 7.4 Integration Risks

| Risk | Severity | Description |
|---|---|---|
| Payment integration undefined | HIGH | No integration spec exists. If unavailable, approved invoices accumulate with no payment initiated. |
| Email delivery failure | MEDIUM | Unhandled notification failures mean vendors and AP team miss critical status updates. |
| PO data synchronization | MEDIUM | If the PO master list is not real-time synced from an ERP, vendors may submit against stale PO data. |

---

### 7.5 Data Risks

| Risk | Severity | Description |
|---|---|---|
| Data loss on session timeout | MEDIUM | Partially filled invoice forms may be lost when a session expires. |
| Large file upload storage | LOW | Without file size limits, storage costs could escalate and performance may degrade. |
| Incorrect PO–invoice amount matching | HIGH | Without clear partial vs. full amount rules, overpayments or underpayments could occur. |

---

## 8. Open Items

> All items below are blocking open questions. Test design cannot begin until these are confirmed by the client.

| # | Module | Open Question | Priority | Status |
|---|---|---|---|---|
| 1 | Registration | Is vendor registration self-service or admin-approved? | HIGH | Open |
| 2 | Registration | Is email verification required? | HIGH | Open |
| 3 | Invoice | What file formats and max file size are supported? | HIGH | Open |
| 4 | Invoice | Can one invoice be linked to multiple POs? | HIGH | Open |
| 5 | Invoice | What defines a valid vs. invalid PO? | HIGH | Open |
| 6 | Invoice | What are all invoice statuses and allowed transitions? | CRITICAL | Open |
| 7 | Approval | Is approval single-level or multi-level? | CRITICAL | Open |
| 8 | Approval | Is rejection reason mandatory? | HIGH | Open |
| 9 | Approval | Can an approved invoice be reversed? | HIGH | Open |
| 10 | Invoice | Can vendors modify invoices after submission or rejection? | HIGH | Open |
| 11 | Assignment | How are invoices assigned to AP team members? | MEDIUM | Open |
| 12 | Payment | What is the payment system integration method? | CRITICAL | Open |
| 13 | Payment | How is payment failure handled? | HIGH | Open |
| 14 | Dispute | Is there a payment dispute/query mechanism for vendors? | MEDIUM | Open |
| 15 | Notifications | On which events are notifications sent and to whom? | HIGH | Open |
| 16 | Reporting | What does the monthly report contain and in what format? | MEDIUM | Open |
| 17 | Security | What is the complete role list and permission matrix? | CRITICAL | Open |
| 18 | Duplicate | What fields define a duplicate invoice? | HIGH | Open |
| 19 | Audit | Is an audit trail required? What actions are logged? | HIGH | Open |
| 20 | Invoice | Is partial invoice submission allowed (amount less than PO value)? If yes, can multiple partial invoices be raised against the same PO? | HIGH | Open |

---
