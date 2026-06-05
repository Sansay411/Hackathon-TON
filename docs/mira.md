# Mira

Mira is the intelligence layer.

Current review output:

- clarityScore
- riskLevel
- missingItems
- disputeRisks
- suggestedTerms

Used for:

- job review
- proposal review architecture
- future dispute summary architecture

DeepSeek is currently wired behind the Mira adapter when `DEEPSEEK_API_KEY` is configured. Without credentials, the app uses a clearly bounded development provider.
