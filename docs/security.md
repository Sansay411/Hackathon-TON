# Security

WorkPay does not trust the frontend for critical state.

Server-side validation is required for:

- Telegram initData
- profile ownership
- wallet address
- energy balance
- duplicate applications
- payment verification
- release verification
- deal status transitions

Forbidden:

- fake funded status
- fake released status
- manual trusted transaction hash confirmation
- completing deals without release architecture
- negative Energy spending
- duplicate job applications
