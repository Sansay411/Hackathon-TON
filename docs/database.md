# Database

The foundation schema is PostgreSQL via Supabase.

## Tables

`profiles` stores Telegram identity and wallet linkage.

`deals` stores client, freelancer, terms, pricing, status, AI review summary, and funding/release transaction references.

`payments` stores payer, receiver, escrow wallet, amount, asset, network, status, and transaction hash.

`deliveries` stores freelancer submissions and optional storage path.

`deal_events` stores immutable audit events for lifecycle visibility.

## RLS

RLS is enabled on every public table.

The first migration includes broad authenticated-user policies so the app can be wired while Telegram-to-Supabase identity is finalized. Before production, replace these policies with participant-scoped checks against `profiles`, `deals.client_id`, and `deals.freelancer_id`.

## Realtime

Deals, payments, deliveries, and deal events are added to `supabase_realtime` publication.

## Service Role

Service role operations should be limited to server-only route handlers and background jobs. The service role key must never be exposed through `NEXT_PUBLIC_` environment variables.
