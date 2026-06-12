# QA Artifacts
## B2B Vendor Invoice Management Portal

> **Document Type:** QA Artifacts — Pre-Development to Execution
> **Version:** 1.0 — Draft
> **Date:** June 2026
> **Status:** Draft — Pending Requirement Sign-Off

---

## Table of Contents

1. [Test Strategy](#1-test-strategy)
2. [Test Scenarios](#2-test-scenarios)
3. [Test Cases](#3-test-cases)
4. [Test Data](#4-test-data)
5. [Requirements Traceability Matrix (RTM)](#5-requirements-traceability-matrix-rtm)

---

## 1. Test Strategy

### 1.1 Objective

Validate that the Vendor Invoice Management Portal meets all functional, security, integration, and business requirements before go-live. Ensure core workflows — vendor registration, invoice submission, AP approval, payment forwarding, and notifications — are reliable, secure, and correct.

---

### 1.2 Scope

**In Scope**
- Vendor registration and email verification
- Vendor login, session management, and account lockout
- Invoice creation, submission, and file upload
- Purchase order validation and invoice-PO mapping
- AP team approval and rejection workflow
- Payment forwarding integration
- Email notification triggers and delivery
- Monthly reporting
- Role-based access control (RBAC)
- Duplicate invoice detection
- Audit trail (if confirmed in scope by client)

**Out of Scope**
- Payment processing system internals (tested via mocks)
- Email server infrastructure and deliverability
- ERP / PO master data system internals
- Vendor bank account validation (handled by external payment system)
- Performance / load testing (Phase 2)
- Mobile responsiveness (not stated in requirements)

---

### 1.3 Testing Types

| Type | Purpose | When |
|---|---|---|
| Functional Testing | Verify all features work as per requirements | Every sprint / release |
| Negative Testing | Verify system handles invalid inputs and unauthorized actions | Every sprint / release |
| Boundary Value Testing | Test at data limits (file size, amount, date range) | With functional testing |
| Integration Testing | Verify payment API and notification system integrations | Post functional sign-off |
| Security Testing | Verify RBAC, URL manipulation, injection attacks | Pre-UAT |
| Regression Testing | Ensure new changes do not break existing functionality | Each build |
| UAT | Client validates business scenarios end-to-end | Post QA sign-off |

---

## 2. Test Scenarios

### Module: Registration & Authentication

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-REG-01 | Vendor registers with all valid mandatory fields | Positive | HIGH | R1 |
| TS-REG-02 | Vendor registers with an already-used email address | Negative | HIGH | R1 |
| TS-REG-03 | Vendor submits registration form with mandatory fields missing | Negative | HIGH | R1 |
| TS-REG-04 | Vendor receives and completes email verification after registration | Positive | HIGH | R1 |
| TS-REG-05 | Vendor attempts to log in before verifying email | Negative | HIGH | R1 |
| TS-LOG-01 | Vendor logs in with valid credentials | Positive | HIGH | R1 |
| TS-LOG-02 | Vendor enters incorrect password | Negative | HIGH | R1 |
| TS-LOG-03 | Vendor requests and completes password reset | Positive | MEDIUM | R1 |

---

### Module: Non-Functional Requirements

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-NFR-01 | Account locks after 5 consecutive failed login attempts | NFR – Security | HIGH | R7 |
| TS-NFR-02 | Expired or already-used password reset link is rejected | NFR – Security | MEDIUM | R1 |
| TS-NFR-03 | Session expires mid-action and user is redirected to login | NFR – Session Management | MEDIUM | R1 |

---

### Module: Invoice Submission & File Upload

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-INV-01 | Vendor submits a valid invoice linked to an open PO with a valid attachment | Positive | CRITICAL | R2 |
| TS-INV-02 | Vendor submits an invoice with no file attachment | Negative | HIGH | R2 |
| TS-INV-03 | Vendor uploads a supported file format (PDF) | Positive | HIGH | R2 |
| TS-INV-04 | Vendor uploads an unsupported file format (.exe, .zip, .docx) | Negative | HIGH | R2 |
| TS-INV-05 | Vendor uploads a file exceeding the 10MB size limit | Boundary | HIGH | R2 |
| TS-INV-06 | Vendor uploads a corrupted or zero-byte file | Negative | HIGH | R2 |
| TS-INV-07 | Vendor submits an invoice with a duplicate invoice number | Negative | HIGH | R2 |
| TS-INV-08 | Vendor submits an invoice with a future invoice date | Negative | MEDIUM | R2 |
| TS-INV-09 | Vendor submits an invoice with a date before the PO creation date | Negative | MEDIUM | R2 |
| TS-INV-10 | Network drops during mid-upload | Edge | MEDIUM | R2 |

---

### Module: Purchase Order Mapping

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-PO-01 | Vendor links invoice to a valid open PO | Positive | CRITICAL | R2 |
| TS-PO-02 | Vendor enters a PO number that does not exist | Negative | HIGH | R2 |
| TS-PO-03 | Vendor submits invoice against a closed PO | Negative | HIGH | R2 |
| TS-PO-04 | Vendor submits invoice against a cancelled PO | Negative | HIGH | R2 |
| TS-PO-05 | Vendor submits invoice against a fully consumed PO (zero remaining balance) | Negative | HIGH | R2 |
| TS-PO-06 | Invoice amount exceeds the remaining PO balance | Boundary | HIGH | R2 |
| TS-PO-07 | Invoice amount is less than PO amount (partial billing) | Positive | HIGH | R2 |

---

### Module: Approval Workflow

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-APR-01 | AP team member approves a valid submitted invoice with a comment | Positive | CRITICAL | R3 |
| TS-APR-02 | AP team member rejects an invoice with a mandatory reason | Positive | CRITICAL | R3 |
| TS-APR-03 | AP team member attempts to reject an invoice without providing a reason | Negative | HIGH | R3 |
| TS-APR-04 | Two AP members attempt to approve the same invoice simultaneously | Edge | HIGH | R3 |
| TS-APR-05 | AP member attempts to approve an already-approved invoice | Negative | HIGH | R3 |
| TS-APR-06 | Vendor account is disabled while their invoice is in Pending Approval | Edge | MEDIUM | R3 |
| TS-APR-07 | Invoice is still pending approval after 30+ days | Edge | LOW | R3 |

---

### Module: Invoice Modification

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-MOD-01 | Vendor edits and resubmits a rejected invoice with corrections | Positive | HIGH | R2, R3 |
| TS-MOD-02 | Vendor attempts to edit an invoice in Approved status | Negative | HIGH | R2 |
| TS-MOD-03 | Vendor attempts to edit an invoice in Paid status | Negative | HIGH | R2 |
| TS-MOD-04 | Vendor resubmits a rejected invoice with no changes made | Negative | MEDIUM | R2 |
| TS-MOD-05 | Vendor modifies invoice amount to exceed the PO balance | Negative | HIGH | R2 |

---

### Module: Payment Processing

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-PAY-01 | Approved invoice is automatically forwarded to the payment system | Positive | CRITICAL | R4 |
| TS-PAY-02 | Payment API call fails due to timeout | Negative | HIGH | R4 |
| TS-PAY-03 | Invoice approved but not forwarded due to a system error | Edge | HIGH | R4 |
| TS-PAY-04 | Same invoice is forwarded to payment processing twice | Edge | CRITICAL | R4 |
| TS-PAY-05 | Payment succeeds and invoice status updates to Paid | Positive | HIGH | R4 |

---

### Module: Notifications

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-NOT-01 | Email sent to vendor and AP team on invoice submission | Positive | HIGH | R5 |
| TS-NOT-02 | Email sent to both parties on invoice approval | Positive | HIGH | R5 |
| TS-NOT-03 | Email sent to vendor on invoice rejection | Positive | HIGH | R5 |
| TS-NOT-04 | Email notification fails to deliver (invalid address / mail server down) | Negative | MEDIUM | R5 |
| TS-NOT-05 | Vendor changes registered email while a notification is pending | Edge | MEDIUM | R5 |

---

### Module: Reporting

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-REP-01 | Monthly report auto-generated on the 1st with active invoice data | Positive | HIGH | R6 |
| TS-REP-02 | Monthly report generated for a period with zero invoices | Edge | MEDIUM | R6 |
| TS-REP-03 | AP team member views and downloads the monthly report | Positive | HIGH | R6 |
| TS-REP-04 | Vendor attempts to access the monthly report | Negative | HIGH | R6, R7 |
| TS-REP-05 | User attempts to generate a report for a future month | Negative | MEDIUM | R6 |

---

### Module: Audit Trail

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-AUD-01 | Audit log records invoice submission with vendor and timestamp details | Positive | HIGH | Implied |
| TS-AUD-02 | Audit log records invoice approval with AP member and timestamp details | Positive | HIGH | Implied |
| TS-AUD-03 | Audit log records invoice rejection with reason, AP member, and timestamp | Positive | HIGH | Implied |
| TS-AUD-04 | Audit log records invoice modification with changed fields and vendor details | Positive | HIGH | Implied |
| TS-AUD-05 | AP team member can view the full audit trail of an invoice | Positive | HIGH | Implied |
| TS-AUD-06 | Vendor cannot access the audit trail | Negative | HIGH | Implied |

---

### Module: Security & Access Control

| TS-ID | Scenario | Type | Priority | Req |
|---|---|---|---|---|
| TS-SEC-01 | Vendor accesses another vendor's invoice via direct URL manipulation | Negative | CRITICAL | R7 |
| TS-SEC-02 | Unauthenticated user accesses invoice pages directly via URL | Negative | CRITICAL | R7 |
| TS-SEC-03 | AP team member attempts to access admin-only pages without the admin role | Negative | HIGH | R7 |
| TS-SEC-04 | Session token expires mid-action; user is redirected to login | Edge | HIGH | R7 |
| TS-SEC-05 | SQL injection attempted in invoice number or description field | Security | HIGH | R7 |
| TS-SEC-06 | XSS attempted in form input fields | Security | HIGH | R7 |

---

## 3. Test Cases

### Module: Registration

---

**TC-REG-01**
| Field | Detail |
|---|---|
| **Scenario** | Vendor registers with all valid details |
| **Type** | Positive |
| **Priority** | HIGH |
| **Req** | R1 |
| **Preconditions** | Registration page is accessible; `newvendor@test.com` is not already registered |
| **Steps** | 1. Navigate to the registration page. 2. Enter valid company name. 3. Enter `newvendor@test.com`. 4. Enter a valid password. 5. Fill all mandatory fields. 6. Click Register. |
| **Expected Result** | Account is created. Verification email is sent to the registered address. Confirmation message is displayed. |

---

**TC-REG-02**
| Field | Detail |
|---|---|
| **Scenario** | Vendor registers with an already-registered email |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R1 |
| **Preconditions** | Account with `existing@vendor.com` already exists |
| **Steps** | 1. Navigate to the registration page. 2. Enter `existing@vendor.com`. 3. Fill all other fields with valid data. 4. Click Register. |
| **Expected Result** | Registration fails. Error: "An account with this email already exists." No new account is created. |

---

**TC-REG-03**
| Field | Detail |
|---|---|
| **Scenario** | Registration form submitted with mandatory fields missing |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R1 |
| **Preconditions** | Registration page is accessible |
| **Steps** | 1. Navigate to the registration page. 2. Leave email and company name fields blank. 3. Click Register. |
| **Expected Result** | Form submission blocked. Inline validation errors shown against each empty mandatory field. |

---

**TC-REG-04**
| Field | Detail |
|---|---|
| **Scenario** | Vendor attempts to log in before verifying email |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R1 |
| **Preconditions** | Vendor has registered but has not verified their email |
| **Steps** | 1. Navigate to the login page. 2. Enter registered email and password. 3. Click Login. |
| **Expected Result** | Login fails. Message: "Please verify your email address before logging in." |

---

### Module: Login & Authentication

---

**TC-LOG-01**
| Field | Detail |
|---|---|
| **Scenario** | Vendor logs in with valid credentials |
| **Type** | Positive |
| **Priority** | HIGH |
| **Req** | R1 |
| **Preconditions** | Account `vendor1@test.com` is active and email is verified |
| **Steps** | 1. Navigate to the login page. 2. Enter valid email and password. 3. Click Login. |
| **Expected Result** | Login succeeds. Vendor is redirected to their invoice dashboard showing only their own invoices. |

---

**TC-LOG-02**
| Field | Detail |
|---|---|
| **Scenario** | Account locks after 5 consecutive failed login attempts |
| **Type** | NFR – Security |
| **Priority** | HIGH |
| **Req** | R7 |
| **Preconditions** | Account is active |
| **Steps** | 1. Navigate to the login page. 2. Enter valid email and an incorrect password. 3. Repeat step 2 five times. |
| **Expected Result** | After the 5th failed attempt, account is locked. Login is blocked and a lockout message is displayed. |

---

**TC-LOG-03**
| Field | Detail |
|---|---|
| **Scenario** | Vendor requests and completes a password reset |
| **Type** | Positive |
| **Priority** | MEDIUM |
| **Req** | R1 |
| **Preconditions** | Account is active and email is verified |
| **Steps** | 1. Navigate to the login page. 2. Click "Forgot Password". 3. Enter the registered email address. 4. Submit the request. 5. Open the reset link from the email. 6. Enter and confirm a new password. 7. Submit. |
| **Expected Result** | Password is updated. Vendor can log in with the new password. The reset link is no longer valid after use. |

---

### Module: Invoice Submission

---

**TC-INV-01**
| Field | Detail |
|---|---|
| **Scenario** | Vendor submits a valid invoice linked to an open PO |
| **Type** | Positive |
| **Priority** | CRITICAL |
| **Req** | R2 |
| **Preconditions** | Vendor is logged in; `PO-2026-001` is open with remaining balance 50,000 |
| **Steps** | 1. Navigate to Submit Invoice. 2. Enter invoice number `INV-2026-001`. 3. Enter today's date. 4. Enter amount `5000`. 5. Enter PO `PO-2026-001`. 6. Attach `invoice_valid.pdf` (2MB). 7. Click Submit. |
| **Expected Result** | Invoice created with status Submitted. Vendor sees confirmation with invoice ID. AP team receives email notification. |

---

**TC-INV-02**
| Field | Detail |
|---|---|
| **Scenario** | Vendor uploads a file exceeding 10MB |
| **Type** | Boundary |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | Vendor is logged in; `invoice_large.pdf` is 11MB |
| **Steps** | 1. Navigate to Submit Invoice. 2. Fill all valid invoice fields. 3. Attach `invoice_large.pdf` (11MB). 4. Click Submit. |
| **Expected Result** | Upload rejected. Error: "File size exceeds the 10MB limit." Invoice is not submitted. |

---

**TC-INV-03**
| Field | Detail |
|---|---|
| **Scenario** | Vendor submits invoice with a duplicate invoice number |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | Invoice `INV-2026-001` has already been submitted by the same vendor |
| **Steps** | 1. Navigate to Submit Invoice. 2. Enter invoice number `INV-2026-001`. 3. Fill all other fields with valid data. 4. Click Submit. |
| **Expected Result** | Submission fails. Error: "Invoice number INV-2026-001 already exists for your account." |

---

**TC-INV-04**
| Field | Detail |
|---|---|
| **Scenario** | Vendor uploads an unsupported file type |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | Vendor is logged in |
| **Steps** | 1. Navigate to Submit Invoice. 2. Fill all valid invoice fields. 3. Attach `malware.exe`. 4. Click Submit. |
| **Expected Result** | Upload blocked. Error: "Unsupported file format. Accepted formats: PDF, JPEG." |

---

**TC-INV-05**
| Field | Detail |
|---|---|
| **Scenario** | Vendor submits invoice with no file attachment |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | Vendor is logged in; file attachment is mandatory |
| **Steps** | 1. Navigate to Submit Invoice. 2. Fill all invoice fields with valid data. 3. Do not attach any file. 4. Click Submit. |
| **Expected Result** | Submission blocked. Error: "Invoice attachment is required." |

---

**TC-INV-06**
| Field | Detail |
|---|---|
| **Scenario** | Vendor uploads a corrupted or zero-byte file |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | Vendor is logged in; `invoice_corrupt.pdf` is 0KB |
| **Steps** | 1. Navigate to Submit Invoice. 2. Fill all valid invoice fields. 3. Attach `invoice_corrupt.pdf` (0KB). 4. Click Submit. |
| **Expected Result** | Upload rejected. Error indicating the file is invalid or empty. Invoice is not submitted. |

---

**TC-INV-07**
| Field | Detail |
|---|---|
| **Scenario** | Vendor submits invoice with a future date |
| **Type** | Negative |
| **Priority** | MEDIUM |
| **Req** | R2 |
| **Preconditions** | Vendor is logged in |
| **Steps** | 1. Navigate to Submit Invoice. 2. Fill all valid fields. 3. Set invoice date to `2027-01-01`. 4. Attach valid file. 5. Click Submit. |
| **Expected Result** | Submission fails. Error: "Invoice date cannot be a future date." |

---

**TC-INV-08**
| Field | Detail |
|---|---|
| **Scenario** | Vendor submits invoice with a date before the PO creation date |
| **Type** | Negative |
| **Priority** | MEDIUM |
| **Req** | R2 |
| **Preconditions** | Vendor is logged in; `PO-2026-001` has a creation date of 2026-01-01 |
| **Steps** | 1. Navigate to Submit Invoice. 2. Fill all valid fields. 3. Set invoice date to `2025-12-01` (before PO creation date). 4. Enter PO `PO-2026-001`. 5. Attach valid file. 6. Click Submit. |
| **Expected Result** | Submission fails. Error: "Invoice date cannot be earlier than the PO creation date." |

---

### Module: Purchase Order Mapping

---

**TC-PO-01**
| Field | Detail |
|---|---|
| **Scenario** | Vendor submits invoice against a non-existent PO |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | `PO-FAKE-999` does not exist |
| **Steps** | 1. Navigate to Submit Invoice. 2. Fill all valid invoice fields. 3. Enter PO `PO-FAKE-999`. 4. Click Submit. |
| **Expected Result** | Submission fails. Error: "PO number PO-FAKE-999 was not found." |

---

**TC-PO-02**
| Field | Detail |
|---|---|
| **Scenario** | Vendor submits invoice against a fully consumed PO |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | `PO-2026-003` has remaining balance of 0 |
| **Steps** | 1. Navigate to Submit Invoice. 2. Fill valid invoice fields. 3. Enter PO `PO-2026-003`. 4. Click Submit. |
| **Expected Result** | Submission fails. Error: "PO-2026-003 has no remaining balance." |

---

**TC-PO-03**
| Field | Detail |
|---|---|
| **Scenario** | Invoice amount exceeds the remaining PO balance |
| **Type** | Boundary |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | `PO-2026-002` has remaining balance of 5,000 |
| **Steps** | 1. Navigate to Submit Invoice. 2. Enter amount `6000`. 3. Enter PO `PO-2026-002`. 4. Click Submit. |
| **Expected Result** | Submission fails. Error: "Invoice amount 6,000 exceeds the remaining PO balance of 5,000." |

---

**TC-PO-04**
| Field | Detail |
|---|---|
| **Scenario** | Vendor submits invoice against a closed PO |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | `PO-2026-004` has status Closed |
| **Steps** | 1. Navigate to Submit Invoice. 2. Fill all valid invoice fields. 3. Enter PO `PO-2026-004`. 4. Click Submit. |
| **Expected Result** | Submission fails. Error: "PO-2026-004 is closed and cannot be invoiced against." |

---

**TC-PO-05**
| Field | Detail |
|---|---|
| **Scenario** | Vendor submits a partial invoice against an open PO |
| **Type** | Positive |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | `PO-2026-001` is open with total value 50,000 |
| **Steps** | 1. Navigate to Submit Invoice. 2. Enter amount `10000` (partial of 50,000). 3. Enter PO `PO-2026-001`. 4. Attach valid file. 5. Click Submit. |
| **Expected Result** | Invoice submitted successfully with status Submitted. PO remaining balance updates to 40,000. |

---

**TC-PO-06**
| Field | Detail |
|---|---|
| **Scenario** | Vendor submits invoice against a cancelled PO |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | `PO-2026-005` has status Cancelled |
| **Steps** | 1. Navigate to Submit Invoice. 2. Fill all valid invoice fields. 3. Enter PO `PO-2026-005`. 4. Click Submit. |
| **Expected Result** | Submission fails. Error: "PO-2026-005 is cancelled and cannot be invoiced against." |

---

### Module: Approval Workflow

---

**TC-APR-01**
| Field | Detail |
|---|---|
| **Scenario** | AP team member approves a submitted invoice |
| **Type** | Positive |
| **Priority** | CRITICAL |
| **Req** | R3 |
| **Preconditions** | Invoice `INV-2026-001` is in Submitted status; AP member is logged in with approval privileges |
| **Steps** | 1. Navigate to the invoice queue. 2. Open invoice `INV-2026-001`. 3. Enter an approval comment. 4. Click Approve. |
| **Expected Result** | Invoice status changes to Approved. Both vendor and AP team receive email notifications. Invoice is forwarded to payment processing. |

---

**TC-APR-02**
| Field | Detail |
|---|---|
| **Scenario** | AP team member rejects an invoice with a reason |
| **Type** | Positive |
| **Priority** | CRITICAL |
| **Req** | R3 |
| **Preconditions** | Invoice is in Submitted status |
| **Steps** | 1. Open a submitted invoice. 2. Click Reject. 3. Enter a rejection reason. 4. Click Confirm Rejection. |
| **Expected Result** | Invoice status changes to Rejected. Vendor receives an email notification with the rejection reason. |

---

**TC-APR-03**
| Field | Detail |
|---|---|
| **Scenario** | AP member attempts to reject an invoice without a reason |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R3 |
| **Preconditions** | Invoice is in Submitted status; rejection reason is mandatory |
| **Steps** | 1. Open a submitted invoice. 2. Click Reject. 3. Leave the reason field blank. 4. Click Confirm Rejection. |
| **Expected Result** | Rejection blocked. Error: "Rejection reason is required." Invoice remains in Submitted status. |

---

**TC-APR-04**
| Field | Detail |
|---|---|
| **Scenario** | Two AP members attempt to approve the same invoice simultaneously |
| **Type** | Edge |
| **Priority** | HIGH |
| **Req** | R3 |
| **Preconditions** | Invoice `INV-2026-001` is in Submitted status; AP Member A and AP Member B both have it open |
| **Steps** | 1. AP Member A and AP Member B open invoice `INV-2026-001`. 2. AP Member A approves. 3. AP Member B approves immediately after. |
| **Expected Result** | AP Member A's approval succeeds; invoice moves to Approved. AP Member B sees: "This invoice has already been actioned." No duplicate approval occurs. |

---

**TC-APR-05**
| Field | Detail |
|---|---|
| **Scenario** | AP member attempts to approve an already-approved invoice |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R3 |
| **Preconditions** | Invoice `INV-2026-011` is already in Approved status |
| **Steps** | 1. Open invoice `INV-2026-011`. 2. Attempt to click Approve. |
| **Expected Result** | Approve action is not available or is blocked. Current invoice status shown as Approved with no further action possible. |

---

**TC-APR-06**
| Field | Detail |
|---|---|
| **Scenario** | Vendor account is disabled while their invoice is in Pending Approval |
| **Type** | Edge |
| **Priority** | MEDIUM |
| **Req** | R3 |
| **Preconditions** | Invoice `INV-2026-001` is in Submitted status; vendor account `vendor1@test.com` is active |
| **Steps** | 1. Admin disables the vendor account `vendor1@test.com`. 2. AP member opens the pending invoice `INV-2026-001`. 3. AP member attempts to approve the invoice. |
| **Expected Result** | Invoice remains accessible to the AP team. AP member can approve or reject the invoice. The disabled vendor account does not block the invoice workflow. |

---

### Module: Invoice Modification

---

**TC-MOD-01**
| Field | Detail |
|---|---|
| **Scenario** | Vendor edits and resubmits a rejected invoice |
| **Type** | Positive |
| **Priority** | HIGH |
| **Req** | R2, R3 |
| **Preconditions** | Invoice `INV-2026-001` is in Rejected status |
| **Steps** | 1. Vendor navigates to rejected invoice `INV-2026-001`. 2. Clicks Edit. 3. Corrects the invoice amount. 4. Clicks Resubmit. |
| **Expected Result** | Invoice is updated and status changes back to Submitted. AP team receives a notification of resubmission. |

---

**TC-MOD-02**
| Field | Detail |
|---|---|
| **Scenario** | Vendor attempts to edit an invoice in Approved status |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | Invoice `INV-2026-011` is in Approved status |
| **Steps** | 1. Vendor navigates to invoice `INV-2026-011`. 2. Attempts to click Edit. |
| **Expected Result** | Edit action is not available. Invoice details are read-only. No modification is possible. |

---

**TC-MOD-03**
| Field | Detail |
|---|---|
| **Scenario** | Vendor attempts to edit an invoice in Paid status |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | Invoice `INV-2026-012` is in Paid status |
| **Steps** | 1. Vendor navigates to invoice `INV-2026-012`. 2. Attempts to click Edit. |
| **Expected Result** | Edit action is not available. Invoice is read-only. Status shown as Paid with no further action allowed. |

---

**TC-MOD-04**
| Field | Detail |
|---|---|
| **Scenario** | Vendor resubmits a rejected invoice with no changes made |
| **Type** | Negative |
| **Priority** | MEDIUM |
| **Req** | R2 |
| **Preconditions** | Invoice `INV-2026-010` is in Rejected status |
| **Steps** | 1. Vendor navigates to rejected invoice `INV-2026-010`. 2. Clicks Edit. 3. Makes no changes to any field. 4. Clicks Resubmit. |
| **Expected Result** | Resubmission is blocked. Message: "No changes detected. Please update the invoice before resubmitting." |

---

**TC-MOD-05**
| Field | Detail |
|---|---|
| **Scenario** | Vendor modifies rejected invoice amount to exceed the PO balance |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R2 |
| **Preconditions** | Invoice `INV-2026-010` is in Rejected status; `PO-2026-002` has remaining balance of 5,000 |
| **Steps** | 1. Vendor opens rejected invoice `INV-2026-010`. 2. Clicks Edit. 3. Changes the amount to `8000`. 4. Clicks Resubmit. |
| **Expected Result** | Resubmission fails. Error: "Invoice amount 8,000 exceeds the remaining PO balance of 5,000." |

---

### Module: Payment Processing

---

**TC-PAY-01**
| Field | Detail |
|---|---|
| **Scenario** | Approved invoice is automatically forwarded to the payment system |
| **Type** | Positive |
| **Priority** | CRITICAL |
| **Req** | R4 |
| **Preconditions** | Invoice is in Approved status; payment API is available |
| **Steps** | 1. AP member approves invoice `INV-2026-001`. 2. Observe the invoice status. |
| **Expected Result** | Invoice is forwarded to the payment system without manual action. Invoice status updates to Payment Initiated or Paid. |

---

**TC-PAY-02**
| Field | Detail |
|---|---|
| **Scenario** | Payment API call fails on invoice approval |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | R4 |
| **Preconditions** | Payment API is configured to return a failure response |
| **Steps** | 1. AP member approves an invoice. 2. Observe the invoice status and any error indication. |
| **Expected Result** | Invoice remains in Approved status. AP team is notified of the payment forwarding failure. Invoice is flagged for follow-up. |

---

**TC-PAY-03**
| Field | Detail |
|---|---|
| **Scenario** | Same invoice is forwarded to the payment system twice |
| **Type** | Edge |
| **Priority** | CRITICAL |
| **Req** | R4 |
| **Preconditions** | Invoice `INV-2026-001` has already been forwarded to payment successfully |
| **Steps** | 1. Attempt to trigger payment forwarding again for the same invoice (via retry or re-approval). |
| **Expected Result** | Second forwarding is blocked. System detects the duplicate and prevents re-submission to the payment system. |

---

### Module: Notifications

---

**TC-NOT-01**
| Field | Detail |
|---|---|
| **Scenario** | Email sent to vendor and AP team on invoice submission |
| **Type** | Positive |
| **Priority** | HIGH |
| **Req** | R5 |
| **Preconditions** | Vendor and AP team email addresses are valid |
| **Steps** | 1. Vendor submits a valid invoice. 2. Check vendor's email inbox. 3. Check AP team inbox. |
| **Expected Result** | Vendor receives a submission confirmation email. AP team receives a new invoice notification. Both emails include the invoice number and current status. |

---

**TC-NOT-02**
| Field | Detail |
|---|---|
| **Scenario** | Email sent to both parties on invoice approval |
| **Type** | Positive |
| **Priority** | HIGH |
| **Req** | R5 |
| **Preconditions** | Invoice is in Submitted status; vendor and AP team emails are valid |
| **Steps** | 1. AP member approves invoice `INV-2026-001`. 2. Check vendor's email inbox. 3. Check AP team inbox. |
| **Expected Result** | Both vendor and AP team receive an approval notification email with invoice number and updated status. |

---

**TC-NOT-03**
| Field | Detail |
|---|---|
| **Scenario** | Email sent to vendor on invoice rejection |
| **Type** | Positive |
| **Priority** | HIGH |
| **Req** | R5 |
| **Preconditions** | Invoice is in Submitted status; vendor email is valid |
| **Steps** | 1. AP member rejects an invoice with a reason. 2. Check vendor's email inbox. |
| **Expected Result** | Vendor receives a rejection notification email with the invoice number and the rejection reason. |

---

**TC-NOT-04**
| Field | Detail |
|---|---|
| **Scenario** | Email notification fails to deliver |
| **Type** | Negative |
| **Priority** | MEDIUM |
| **Req** | R5 |
| **Preconditions** | Vendor's registered email address is invalid or the mail server is unavailable |
| **Steps** | 1. AP member approves an invoice linked to a vendor with an invalid email address. 2. Observe the notification delivery status. |
| **Expected Result** | System logs the email delivery failure. The invoice status change is not rolled back. An alert or retry mechanism is triggered for the failed notification. |

---

### Module: Security & Access Control

---

**TC-SEC-01**
| Field | Detail |
|---|---|
| **Scenario** | Vendor accesses another vendor's invoice via URL manipulation |
| **Type** | Security |
| **Priority** | CRITICAL |
| **Req** | R7 |
| **Preconditions** | Vendor A is logged in; invoice `INV-B-001` belongs to Vendor B |
| **Steps** | 1. Vendor A is logged in. 2. Manually navigate to `/invoices/INV-B-001`. |
| **Expected Result** | Access denied. System returns 403 or redirects to Vendor A's dashboard. No data from Vendor B is visible. |

---

**TC-SEC-02**
| Field | Detail |
|---|---|
| **Scenario** | Unauthenticated user attempts to access invoice pages directly |
| **Type** | Security |
| **Priority** | CRITICAL |
| **Req** | R7 |
| **Preconditions** | No active session in the browser |
| **Steps** | 1. Open a browser with no active session. 2. Navigate directly to `/invoices` or `/dashboard`. |
| **Expected Result** | User is redirected to the login page. No invoice data is accessible. |

---

**TC-SEC-03**
| Field | Detail |
|---|---|
| **Scenario** | SQL injection attempted in the invoice number field |
| **Type** | Security |
| **Priority** | HIGH |
| **Req** | R7 |
| **Preconditions** | Vendor is logged in and on the invoice submission form |
| **Steps** | 1. Enter `' OR '1'='1` in the invoice number field. 2. Fill all other fields with valid data. 3. Click Submit. |
| **Expected Result** | Input is sanitized. Submission fails with a validation error. No SQL error is exposed. Database is unaffected. |

---

**TC-SEC-04**
| Field | Detail |
|---|---|
| **Scenario** | XSS attempted in invoice description or comment field |
| **Type** | Security |
| **Priority** | HIGH |
| **Req** | R7 |
| **Preconditions** | Vendor is logged in and on the invoice submission form |
| **Steps** | 1. Enter `<script>alert('XSS')</script>` in the description or comments field. 2. Submit the form. 3. Navigate to the invoice view page. |
| **Expected Result** | Script is not executed. Input is rendered as plain text or rejected. No popup or DOM manipulation occurs. |

---

**TC-SEC-05**
| Field | Detail |
|---|---|
| **Scenario** | AP team member attempts to access admin-only pages without the admin role |
| **Type** | Security |
| **Priority** | HIGH |
| **Req** | R7 |
| **Preconditions** | `ap.member1@company.com` is logged in as AP Team Member (not Admin) |
| **Steps** | 1. AP Team Member logs in. 2. Manually navigates to an admin URL such as `/admin/users` or `/admin/audit-logs`. |
| **Expected Result** | Access is denied. System returns 403 Forbidden or redirects to the AP dashboard. No admin data is visible. |

---

### Module: Audit Trail

---

**TC-AUD-01**
| Field | Detail |
|---|---|
| **Scenario** | Audit log captures all key invoice actions |
| **Type** | Positive |
| **Priority** | HIGH |
| **Req** | Implied |
| **Preconditions** | Audit trail is enabled; invoice `INV-2026-001` exists and is in Submitted status |
| **Steps** | 1. Vendor submits invoice `INV-2026-001`. 2. AP member approves the invoice. 3. AP member (or Admin) navigates to the audit log for `INV-2026-001`. 4. Review the audit entries. |
| **Expected Result** | Audit log shows at least two entries: (1) Submission — with vendor name, timestamp; (2) Approval — with AP member name, timestamp, and comment. All entries are read-only. |

---

**TC-AUD-02**
| Field | Detail |
|---|---|
| **Scenario** | Vendor cannot access the invoice audit trail |
| **Type** | Negative |
| **Priority** | HIGH |
| **Req** | Implied |
| **Preconditions** | Vendor is logged in; invoice `INV-2026-001` belongs to that vendor |
| **Steps** | 1. Vendor navigates to invoice `INV-2026-001`. 2. Attempts to access the audit trail or history tab. |
| **Expected Result** | Audit trail is not visible to the vendor. The tab or link is either hidden or returns an access-denied message. |

---

## 4. Test Data

### Vendor Accounts

| Data ID | Email | Password | Status | Purpose |
|---|---|---|---|---|
| TD-USR-01 | `vendor1@test.com` | `Test@1234` | Active, Verified | Primary test vendor |
| TD-USR-02 | `vendor2@test.com` | `Test@1234` | Active, Verified | Second vendor for cross-access tests |
| TD-USR-03 | `unverified@test.com` | `Test@1234` | Registered, Unverified | Email not confirmed |
| TD-USR-04 | `locked@test.com` | `Test@1234` | Locked | Simulate 5 failed login attempts |
| TD-USR-05 | `existing@vendor.com` | `Test@1234` | Active | Duplicate registration test |

---

### AP Team Accounts

| Data ID | Email | Role | Status |
|---|---|---|---|
| TD-AP-01 | `ap.member1@company.com` | AP Team Member | Active |
| TD-AP-02 | `ap.member2@company.com` | AP Team Member | Active |
| TD-AP-03 | `ap.admin@company.com` | AP Manager / Admin | Active |

---

### Purchase Orders

| PO Number | Status | Total Amount | Consumed | Remaining | Notes |
|---|---|---|---|---|---|
| PO-2026-001 | Open | 50,000 | 0 | 50,000 | Standard valid PO |
| PO-2026-002 | Open | 20,000 | 15,000 | 5,000 | Partial balance remaining |
| PO-2026-003 | Open | 10,000 | 10,000 | 0 | Fully consumed |
| PO-2026-004 | Closed | 30,000 | 30,000 | 0 | Closed PO |
| PO-2026-005 | Cancelled | 25,000 | 0 | 25,000 | Cancelled PO |
| PO-FAKE-999 | — | — | — | — | Does not exist in the system |

---

### Invoice Data

| Data ID | Invoice # | Vendor | PO | Amount | Date | Notes |
|---|---|---|---|---|---|---|
| TD-INV-01 | INV-2026-001 | vendor1@test.com | PO-2026-001 | 5,000 | Today | Valid happy path invoice |
| TD-INV-02 | INV-2026-002 | vendor1@test.com | PO-2026-002 | 4,000 | Today | Partial PO usage |
| TD-INV-03 | INV-2026-001 | vendor1@test.com | PO-2026-001 | 5,000 | Today | Duplicate — same number as TD-INV-01 |
| TD-INV-04 | INV-2026-003 | vendor1@test.com | PO-2026-001 | 60,000 | Today | Amount exceeds PO balance |
| TD-INV-05 | INV-2026-004 | vendor1@test.com | PO-FAKE-999 | 5,000 | Today | Non-existent PO |
| TD-INV-06 | INV-2026-005 | vendor1@test.com | PO-2026-004 | 5,000 | Today | Closed PO |
| TD-INV-07 | INV-2026-006 | vendor1@test.com | PO-2026-001 | 5,000 | 2027-01-01 | Future invoice date |
| TD-INV-08 | `' OR '1'='1` | vendor1@test.com | PO-2026-001 | 5,000 | Today | SQL injection in invoice number |
| TD-INV-09 | INV-2026-007 | vendor1@test.com | PO-2026-005 | 5,000 | Today | Invoice against cancelled PO (TC-PO-06) |
| TD-INV-10 | INV-2026-008 | vendor1@test.com | PO-2026-002 | 2,000 | Today | Pre-set to Rejected status (TC-MOD-01, TC-MOD-04, TC-MOD-05 preconditions) |
| TD-INV-11 | INV-2026-009 | vendor1@test.com | PO-2026-001 | 5,000 | Today | Pre-set to Paid status (TC-MOD-03 precondition) |
| TD-INV-12 | INV-2026-010 | vendor2@test.com | PO-2026-001 | 3,000 | Today | Belongs to Vendor B — used for cross-vendor access test (TC-SEC-01) |
| TD-INV-13 | INV-2026-011 | vendor1@test.com | PO-2026-001 | 5,000 | Today | Pre-set to Approved status (TC-APR-05, TC-MOD-02 preconditions) |

---

### File Upload Data

| Data ID | File Name | Format | Size | Expected Outcome |
|---|---|---|---|---|
| TD-FILE-01 | invoice_valid.pdf | PDF | 2MB | Accepted |
| TD-FILE-02 | invoice_valid.jpg | JPEG | 1MB | Accepted |
| TD-FILE-03 | invoice_boundary.pdf | PDF | 10MB | Accepted — at the limit |
| TD-FILE-04 | invoice_large.pdf | PDF | 11MB | Rejected — exceeds 10MB limit |
| TD-FILE-05 | invoice.exe | EXE | 500KB | Rejected — unsupported format |
| TD-FILE-06 | invoice.zip | ZIP | 2MB | Rejected — unsupported format |
| TD-FILE-07 | invoice_corrupt.pdf | PDF | 0KB | Rejected — zero-byte / corrupted file |

---

## 5. Requirements Traceability Matrix (RTM)

| Req ID | Requirement | Test Scenarios | Test Cases | Coverage |
|---|---|---|---|---|
| R1 | Vendors can register and log in | TS-REG-01 to TS-REG-05, TS-LOG-01 to TS-LOG-03 | TC-REG-01, TC-REG-02, TC-REG-03, TC-REG-04, TC-LOG-01, TC-LOG-02, TC-LOG-03 | Covered |
| R2 | Vendors can submit invoices against POs | TS-INV-01 to TS-INV-10, TS-PO-01 to TS-PO-07, TS-MOD-01 to TS-MOD-05 | TC-INV-01 to TC-INV-08, TC-PO-01 to TC-PO-06, TC-MOD-01 to TC-MOD-05 | Covered |
| R3 | AP team can view, approve, or reject invoices | TS-APR-01 to TS-APR-07, TS-MOD-01 to TS-MOD-05 | TC-APR-01, TC-APR-02, TC-APR-03, TC-APR-04, TC-APR-05, TC-APR-06, TC-MOD-01 | Covered |
| R4 | Approved invoices forwarded for payment | TS-PAY-01 to TS-PAY-05 | TC-PAY-01, TC-PAY-02, TC-PAY-03 | Covered |
| R5 | Both parties receive email notifications | TS-NOT-01 to TS-NOT-05 | TC-NOT-01, TC-NOT-02, TC-NOT-03, TC-NOT-04 | Covered |
| R6 | System generates monthly invoice reports | TS-REP-01 to TS-REP-05 | Planned post sign-off | Partial |
| R7 | Only authorized users can access the system | TS-SEC-01 to TS-SEC-06, TS-NFR-01 | TC-SEC-01, TC-SEC-02, TC-SEC-03, TC-SEC-04, TC-SEC-05, TC-LOG-02 | Covered |
| Implied | Audit trail for all invoice actions | TS-AUD-01 to TS-AUD-06 | TC-AUD-01, TC-AUD-02 | Covered |

> R6 test cases are pending because report format, content, and access rules are still an open item (Open Item 16). All other requirements (R1–R5, R7) and the implied Audit Trail requirement are fully covered with scenarios and test cases.

---
