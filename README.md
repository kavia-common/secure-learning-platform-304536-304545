# Secure Learning Platform - Vulnerability Labs

An intentionally vulnerable MERN stack application for learning web security. Features 9 hands-on vulnerability labs and a CTF side quest with 20 hidden flags.

## ⚠️ SECURITY WARNING

**This application is INTENTIONALLY VULNERABLE for educational purposes only.**

- **NEVER deploy to production or public internet**
- **Run only in isolated, sandboxed environments**
- **Contains dangerous vulnerabilities including RCE**
- **For learning purposes ONLY**

## 🎯 Features

### 9 Vulnerability Labs (Level Progression)

1. **Level 1: Stored XSS** - Persistent cross-site scripting via comment system
2. **Level 2: Reflected XSS** - URL-based XSS through search parameters
3. **Level 3: DOM XSS** - Client-side XSS via unsafe DOM manipulation
4. **Level 4: NoSQL Injection** - MongoDB operator injection for auth bypass
5. **Level 5: Broken Authentication** - Weak JWT secrets and insecure token handling
6. **Level 6: IDOR** - Insecure direct object references for accessing other users' data
7. **Level 7: CSRF** - Cross-site request forgery on state-changing operations
8. **Level 8: File Upload** - Unrestricted file upload allowing executable files
9. **Level 9: Command Injection** - OS command injection via ping utility

### CTF Side Quest

- 20 hidden flags scattered throughout the application
- Find flags via source code inspection, network analysis, and exploitation
- Track your progress on the dedicated CTF page

### Educational Features

- **OWASP Top 10 Mappings** - Each lab mapped to OWASP categories
- **Detailed Explanations** - Code comments explaining vulnerabilities
- **Remediation Guidance** - Secure coding examples for each vulnerability
- **Interactive Labs** - Hands-on exploitation in dedicated lab pages
- **Progress Tracking** - Track completed labs and captured flags
- **Hints System** - Progressive hints for each lab

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Modern web browser

### Backend Setup

```bash
cd express_backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection string

# Seed database with labs
npm run seed

# Start server
npm run dev
```

Backend runs on http://localhost:3001

### Frontend Setup

```bash
cd react_frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on http://localhost:3000

## 📚 Lab Structure

### Backend (`express_backend/`)

- **Vulnerable Endpoints**: `/api/vulnerable/*` - Intentionally insecure endpoints
- **Lab Management**: `/api/labs/*` - Lab catalog and submission
- **Progress Tracking**: `/api/progress/*` - User progress and leaderboard
- **Authentication**: `/api/auth/*` - Weak-by-design auth system
- **Admin Panel**: `/api/admin/*` - User management

### Frontend (`react_frontend/`)

- **Lab Pages**: `/src/pages/labs/*` - Interactive vulnerability labs
- **Main Pages**: Dashboard, Labs list, Progress, CTF tracker
- **Components**: Reusable UI components
- **API Clients**: Axios-based API integration

## 🔐 Default Credentials

```
Admin User:
Email: admin@example.com
Password: admin

Test User:
Email: victim@example.com
Password: victim123
```

## 🎓 Learning Path

### Recommended Order

1. Start with **Stored XSS** (Level 1) - Easiest vulnerability
2. Progress through **Reflected XSS** and **DOM XSS** (Levels 2-3)
3. Move to **NoSQL Injection** (Level 4)
4. Tackle **Broken Auth** and **IDOR** (Levels 5-6)
5. Challenge yourself with **CSRF** and **File Upload** (Levels 7-8)
6. Master **Command Injection** (Level 9) - Most dangerous

### CTF Flag Hunting

Flags are hidden in:
- HTTP response headers
- API responses
- Browser console logs
- HTML/JS source code
- localStorage/sessionStorage
- Error messages
- JWT tokens
- And more creative locations!

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React 18, React Router, Axios
- **Authentication**: JWT (intentionally weak)
- **API Docs**: Swagger/OpenAPI 3.0

## 📖 API Documentation

Swagger UI available at: http://localhost:3001/docs

OpenAPI spec: http://localhost:3001/openapi.json

## 🔧 Key Files

### Backend

- `src/routes/vulnerable.js` - Vulnerable endpoint routes
- `src/controllers/vulnerableController.js` - Insecure implementations
- `src/models/` - MongoDB schemas (User, Lab, Comment, Flag, etc.)
- `scripts/seed.js` - Database seeding with all labs

### Frontend

- `src/pages/labs/` - Individual vulnerability lab pages
- `src/pages/CTFFlags.js` - CTF flag tracker
- `src/App.js` - Main routing configuration
- `src/components/` - Reusable components

## 🎯 Lab Objectives

### Stored XSS
**Objective**: Post a comment with JavaScript that executes for all users  
**Payload**: `<script>alert('XSS')</script>`

### Reflected XSS
**Objective**: Craft URL that executes JavaScript in search results  
**Payload**: `?q=<script>alert('XSS')</script>`

### DOM XSS
**Objective**: Use URL hash to inject JavaScript client-side  
**Payload**: `#<img src=x onerror="alert('XSS')">`

### NoSQL Injection
**Objective**: Bypass authentication without valid credentials  
**Payload**: `{"email": {"$ne": null}, "password": {"$ne": null}}`

### Broken Auth
**Objective**: Discover weak JWT secret and forge tokens  
**Secret**: `dev-secret`

### IDOR
**Objective**: Access another user's profile without authorization  
**Method**: Change userId parameter in API request

### CSRF
**Objective**: Create malicious page that changes victim's email  
**Method**: Auto-submitting form to vulnerable endpoint

### File Upload
**Objective**: Upload executable file that should be blocked  
**Payload**: Upload .html file with `<script>` tag

### Command Injection
**Objective**: Execute additional OS commands via ping  
**Payload**: `127.0.0.1; whoami`

## 🏆 CTF Flags

20 flags total with hints:
- flag-1 to flag-9: Lab-specific flags
- flag-10 to flag-20: Hidden throughout the application

Check `/ctf` page for hints and submission!

## 🐛 Intentional Vulnerabilities

This application includes (by design):

- ✅ No input validation
- ✅ No output encoding
- ✅ No CSRF protection
- ✅ Weak JWT secrets
- ✅ Plaintext password storage
- ✅ No file upload restrictions
- ✅ Direct command execution
- ✅ Verbose error messages
- ✅ No rate limiting
- ✅ Exposed stack traces

## 📝 Development

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

### Regenerate API Docs
```bash
npm run openapi
```

## 🤝 Educational Use

This platform is designed for:
- Security training workshops
- CTF competitions
- Educational demonstrations
- Penetration testing practice
- Secure coding courses

## 📄 License

Educational use only. Not for production deployment.

## ⚠️ Disclaimer

The creators of this platform are not responsible for any misuse. This application should only be used in controlled, isolated environments for legitimate educational purposes.

---

**Remember**: With great power comes great responsibility. Use your hacking skills ethically! 🛡️
