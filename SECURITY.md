# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to our [Issue Tracker](https://github.com/your-username/link-in-the-bio-app/issues) using the bug report template. You will receive a response from us within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity.

## Security Measures

This application implements several security measures:

1. **Authentication**
   - GitHub OAuth for secure authentication
   - Email allowlist for admin access
   - Secure session management

2. **Data Protection**
   - Local storage encryption for sensitive data
   - Secure image upload and processing
   - Input validation and sanitization

3. **HTTP Security Headers**
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin-when-cross-origin

4. **Best Practices**
   - Regular dependency updates
   - Code scanning for vulnerabilities
   - Secure development guidelines 