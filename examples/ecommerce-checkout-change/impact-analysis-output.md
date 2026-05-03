# Impact Analysis Output

## Impacted Applications

| Application | Impact status | Notes |
|---|---|---|
| Cart service | Confirmed | Must calculate eligibility and discount. |
| Checkout UI | Confirmed | Must display discount and ineligible reasons. |
| Payment service | Suspected | Authorization amount must match discounted order total. |
| Order service | Confirmed | Must store promotion ID and final totals. |
| Email service | Suspected | Confirmation email may show discount line. |
| Analytics/reporting | Confirmed | Promotion usage and payment method reporting required. |

## Upstream Systems

- Promotion configuration.
- Customer profile and stored payment method status.

## Downstream Systems

- Order history.
- Refund processing.
- Confirmation email.
- Analytics and promotion performance reporting.

## Interface/API Impact

- Cart response may need discount amount, promotion code, eligibility status, and ineligible reason.
- Order creation must persist promotion details.

## Data Impact

- Store promotion ID, discount amount, payment method type, eligibility result, and exclusion reason where needed for reporting.

## UI Impact

- Checkout must show discount before payment authorization.
- Ineligible payment methods should not show misleading discount messaging.

## Accounting/GL Impact

- Not applicable / Unknown. Finance should confirm revenue discount reporting rules.

## Batch/EOD Impact

- Not applicable / Unknown. Confirm whether promotion reporting is batch-fed.

## Reporting Impact

- Promotion usage by payment method.
- Discount amount by order and day.
- Exclusion counts for guest checkout, PayPal, gift cards, and renewals.

## Regression Areas

- Cart totals.
- Tax and shipping calculation.
- Payment authorization.
- Refund calculation.
- Guest checkout.
- Subscription renewals.

## Recommendation

Proceed with story slicing by cart eligibility, checkout display, order persistence, and reporting. Confirm refund and finance reporting behavior before final readiness.
