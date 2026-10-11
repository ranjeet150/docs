# Versioning and Release Policy

This document defines the versioning scheme, contract ABI evolution rules, breaking change communication protocol, and 1.0 release criteria for TricklePay across its constituent repositories.

## Scope and Repository Architecture

TricklePay comprises three independent codebases coordinated by this documentation hub:

1. **`tricklepay-contracts`**: Soroban smart contracts written in Rust. Enforces escrow, vesting math, and state immutability. Serves as the system's single source of truth.
2. **`tricklepay-backend`**: Indexer and read service written in TypeScript. Listens for contract events, maintains relational state in Postgres, and provides query APIs.
3. **`tricklepay-frontend`**: Web application built in Next.js. Manages wallet connections and user transactions.

Each repository maintains independent semantic version tags (`vMAJOR.MINOR.PATCH`), but all cross-repository dependencies and breaking interfaces follow the synchronization rules defined below.

---

## Semantic Versioning Rules

All components follow [Semantic Versioning 2.0.0](https://semver.org):

* **MAJOR (`X.0.0`)**: Incompatible changes. For contracts, any alteration to public entrypoint signatures, storage schema layouts, authorization checks, or event payloads. For backend/frontend, breaking API route changes or removal of supported contract versions.
* **MINOR (`0.X.0` / `1.X.0`)**: Backwards-compatible feature additions. New non-breaking contract queries or helper entrypoints, new backend endpoints, or non-breaking UI workflows.
* **PATCH (`0.0.X` / `1.0.X`)**: Backwards-compatible bug fixes, internal algorithmic optimizations, documentation clarifications, and dependency patches.

---

## Contract ABI Evolution & Breaking Changes

Smart contract immutability requires deliberate handling of contract ABI changes:

### What Constitutes a Contract Breaking Change

The following changes require a **MAJOR** version bump:

1. **Public Function Signatures**: Removing a function, renaming an identifier, changing parameter types, altering parameter order, or modifying return types.
2. **Storage Layout**: Mutating existing `DataKey` enum variants, changing struct fields stored in persistent or instance storage, or modifying TTL management behavior in an incompatible manner.
3. **Contract Events**: Changing topic structures or payload schemas expected by the indexer.
4. **Authorization Semantics**: Adding or altering `require_auth` boundaries that invalidate existing caller workflows.

### Breaking Change Propagation & Communication Protocol

When a breaking change to `tricklepay-contracts` is required:

1. **Advance Notice**: An issue tracking the planned breaking change must be opened in `docs` at least 14 days before merging to `main`.
2. **Dual-Version Backend Support**: The backend indexer must be updated to support both the legacy and new contract schemas before any testnet contract redeployment.
3. **Frontend Coordination**: Frontend updates must ship with fallback handling or clear user messaging during migration intervals.
4. **Release Notes**: Every breaking release must include a dedicated migration section detailing:
   * The exact diff in method signatures and event topics.
   * Required database migration scripts for self-hosted backend operators.
   * Recommended user steps for in-flight streams.

---

## 1.0 Release Criteria

TricklePay is currently in pre-1.0 (`v0.1.0`) development. A release will only be tagged `v1.0.0` once all of the following requirements are formally met and verified:

1. **Independent Third-Party Audit**:
   * A full security audit of `tricklepay-contracts` conducted by an established blockchain security auditing firm.
   * Zero unresolved Critical or High severity findings. All Medium severity findings addressed or explicitly accepted with formal risk rationale documented in [SECURITY.md](SECURITY.md).
2. **Testnet Stability & Pilot**:
   * Continuous testnet operation for a minimum of 30 consecutive days with zero unexpected state transitions or contract halts.
   * Comprehensive stress testing under concurrent streaming and withdrawal operations.
3. **Storage & Upgrade Verification**:
   * Complete invariant testing and property-based test suites covering all cliff, cancellation, and partial withdrawal branches.
   * Documented and rehearsed contract upgrade and data migration procedures.
4. **API and ABI Freeze**:
   * Stable contract interface validated by multi-client integrations.
   * Complete OpenAPI / typed specification for all backend indexer endpoints.
5. **Operational Runbooks**:
   * Verified deployment and disaster recovery procedures documented and published.
   * Custody rules and multisig admin procedures documented in [GOVERNANCE.md](GOVERNANCE.md).

---

## Pre-1.0 Stability Expectations

Prior to reaching the 1.0 milestone:

* Releases with `0.x` version numbers may introduce breaking changes within MINOR version increments (`0.1.0` -> `0.2.0`).
* Testnet contract instances may be reset or redeployed; users and developers should not treat testnet streams as persistent stores of value.
* All production integrations are advised to pin exact Git commit hashes or contract addresses rather than tracking floating branches.
