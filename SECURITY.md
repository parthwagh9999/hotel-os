# Security Policy

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in Hotel OS, please report it responsibly:

### How to Report

1. **Email**: Send a detailed report to **security@hotel-os.dev**
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Suggested fix (if any)

### What to Expect

| Timeline | Action |
|----------|--------|
| **24 hours** | Acknowledgment of your report |
| **72 hours** | Initial assessment and severity classification |
| **7 days** | Detailed response with remediation plan |
| **30 days** | Fix developed and deployed (for critical issues) |

## Disclosure Policy

- We follow **coordinated disclosure** — please give us reasonable time to address the issue before public disclosure
- We will credit reporters in our security advisories (unless you prefer anonymity)
- We will not take legal action against researchers who follow this policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x (latest) | ✅ |

## Security Measures

Hotel OS implements the following security practices:

### Authentication & Authorization
- **Argon2** password hashing
- **JWT** with short-lived access tokens and refresh token rotation
- Role-based access control (RBAC) with granular permissions
- Session management with Redis-backed token storage

### API Security
- **Helmet.js** for HTTP security headers
- **CORS** configuration with allowlisted origins
- **Rate limiting** on all endpoints
- Input validation with **class-validator** and **Zod**
- SQL injection prevention via Prisma ORM (parameterized queries)

### Data Protection
- Environment-based configuration (no secrets in code)
- Encrypted data at rest (database-level)
- TLS/HTTPS enforcement in production
- PII handling with data minimization principles

### Infrastructure
- Multi-stage Docker builds (minimal attack surface)
- Non-root container execution
- Dependency vulnerability scanning in CI
- Automated security updates via Dependabot

## Security Best Practices for Deployers

1. **Always change default secrets** in `.env` before deploying
2. **Enable HTTPS** in production with a valid TLS certificate
3. **Restrict database access** to application containers only
4. **Keep dependencies updated** — run `npm audit` regularly
5. **Enable logging and monitoring** for anomaly detection
6. **Use a reverse proxy** (e.g., Nginx, Caddy) in production

---

Thank you for helping keep Hotel OS secure! 🔒
