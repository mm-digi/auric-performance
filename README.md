# Auric Performance

Stripped-back marketing site for Auric Performance: Home, Programmes and Contact.

Built as a Marchon-style preview for Courtney and Alex. Programme descriptions and prices are placeholders until they send final wording.

## 280 Club booking

Bookings, payments, the waiting list, customer accounts, health screening and emails for `/280-club`. Built with Supabase (database), Stripe Checkout (payments and refunds) and Resend (emails).

Setup:

1. In Supabase, open the SQL editor and run `supabase/migrations/0001_280_club_booking.sql`, then `0002_280_club_lifecycle.sql`, then `0003_280_club_grants.sql`, then `0004_280_club_search_path.sql`, then `0005_280_club_accounts_screening.sql`.
2. Copy `.env.example` to `.env.local` and fill it in. Add the same variables in Vercel.
3. In Resend, verify the `auricperformance.co.uk` domain so emails can be sent from `bookings@`.
4. Stripe: add `STRIPE_SECRET_KEY`. Add a webhook endpoint at `https://www.auricperformance.co.uk/api/280-club/stripe-webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `checkout.session.expired`, then put its signing secret in `STRIPE_WEBHOOK_SECRET`.
   Until Stripe is set up, local development confirms bookings without payment. Production shows "Online booking opens soon".
5. Production also stays closed until `CLUB_PRIVACY_NOTICE_READY=true`, because booking collects health information and the privacy notice must be published first.
6. Customers sign in at `/280-club/sign-in` with a one-time emailed code. Their details, emergency contact and children are saved, and the health questionnaire is completed with the first booking and re-confirmed on later ones.
7. Coaches see bookings and can cancel a class (which refunds everyone) at `/admin`. They sign in at `/admin/sign-in` with an email listed in `CLUB_ADMIN_EMAILS`, the shared `CLUB_ADMIN_PASSWORD` and an emailed code. Coaches in `CLUB_HEALTH_REVIEWERS` review health screening at `/admin/screening`.

Health screenings, consents, reviews, profile history and the access log are read-only in the database: they can't be edited or deleted, only added to.

The class settings (capacity, price, weeks open for booking, refund cut-off), the waiver, health questions, consent wording and cancellation policy are in `lib/club/config.ts`. The source documents are in the `Docs` folder next to the repo.
