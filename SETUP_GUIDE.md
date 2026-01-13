# Setup Guide - Secure Learning Platform

## For Instructors

### Environment Setup

1. **Isolated Network**: Deploy on isolated network or localhost only
2. **Virtual Machines**: Use VMs or containers for additional isolation
3. **Monitoring**: Monitor student activities for learning assessment

### Database Seeding

The seed script creates:
- Admin user (admin@example.com / admin)
- Test user (victim@example.com / victim123)
- 9 vulnerability labs with hints
- CTF flag definitions

```bash
cd express_backend
npm run seed
```

### Customization

#### Add New Labs

Edit `express_backend/scripts/seed.js`:

```javascript
{
  slug: 'custom-lab',
  title: 'Your Lab Title',
  description: 'Lab description',
  category: 'injection',
  difficulty: 'medium',
  estimatedMinutes: 20,
  objective: 'What students should accomplish',
  remediation: 'How to fix the vulnerability',
  solutionCheck: {
    type: 'exact', // or 'contains', 'regex'
    value: 'expected-answer',
    successMessage: 'Success feedback',
    failureMessage: 'Try again message',
  },
  isPublished: true,
  level: 10,
  owaspCategory: 'A03:2021 - Injection',
}
```

#### Add CTF Flags

Edit `express_backend/src/controllers/vulnerableController.js`:

```javascript
const CTF_FLAGS = {
  'flag-21': 'CTF{y0ur_cust0m_fl4g}',
  // ... add more
};
```

### Security Considerations

**CRITICAL**: Ensure the following before deploying:

1. ✅ Network isolated from internet
2. ✅ Firewall rules in place
3. ✅ VMs/containers properly sandboxed
4. ✅ MongoDB not exposed externally
5. ✅ Students informed of ethical guidelines

## For Students

### Getting Started

1. **Register Account**: Create your account on the platform
2. **Review Dashboard**: Understand progress tracking
3. **Start Level 1**: Begin with Stored XSS (easiest)
4. **Use Hints**: Don't hesitate to use hints when stuck
5. **Read Code**: Study the vulnerable code examples

### Lab Workflow

1. **Read Objective**: Understand what you need to accomplish
2. **Launch Interactive Lab**: Click "🚀 Launch Lab" button
3. **Experiment**: Try different payloads and techniques
4. **Use DevTools**: Browser developer tools are essential
5. **Submit Solution**: Submit your findings to mark lab complete

### Tools You'll Need

**Browser Extensions:**
- React DevTools
- EditThisCookie
- ModHeader

**Developer Tools:**
- Browser Console (F12)
- Network tab for HTTP traffic
- Application tab for storage inspection
- Sources tab for debugging

**Optional:**
- Burp Suite (for advanced students)
- Postman (for API testing)
- jwt.io (for JWT decoding)

### CTF Flag Hunting Tips

**Check Everywhere:**
- View page source (Ctrl+U)
- Inspect HTTP headers in Network tab
- Look in Console for debug messages
- Check localStorage/sessionStorage
- Examine cookies
- Read API responses carefully
- Look for HTML comments
- Test for hidden files (robots.txt)
- Analyze JWT tokens

**Common Flag Locations:**
- Response headers (`X-*` headers)
- API response bodies
- Browser console logs
- localStorage/sessionStorage
- HTML source comments
- Error messages
- JWT payload
- Cookie values

### Learning Resources

**While Exploiting:**
- Read the code comments explaining vulnerabilities
- Check the "Remediation" section for secure alternatives
- Understand the OWASP category mapping
- Review the example payloads provided

**External Resources:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- PortSwigger Academy: https://portswigger.net/web-security
- MDN Web Docs: https://developer.mozilla.org/
- HackerOne Blog: https://www.hackerone.com/blog

### Ethical Guidelines

**DO:**
✅ Experiment within the platform
✅ Learn about vulnerabilities
✅ Practice responsible disclosure
✅ Help fellow students
✅ Report bugs to instructors

**DON'T:**
❌ Attack real websites
❌ Use skills maliciously
❌ Share solutions publicly
❌ Bypass instructor monitoring
❌ Attempt to escape the sandbox

### Progress Tracking

- **Labs Page**: See all available labs and your progress
- **Progress Page**: Detailed statistics and leaderboard
- **CTF Page**: Track captured flags (20 total)
- **Dashboard**: Quick overview of your achievements

### Getting Help

**If Stuck:**
1. Review the lab objective carefully
2. Use progressive hints (cost points)
3. Check the code comments in lab pages
4. Examine example payloads
5. Ask instructor for guidance

**Common Issues:**

**XSS not executing?**
- Check if special characters are encoded
- Try different HTML tags
- Look at how data is rendered (innerHTML vs textContent)

**NoSQL injection failing?**
- Ensure you're sending JSON, not form data
- Check Content-Type header
- Verify object structure

**Command injection not working?**
- Try different separators (; && || |)
- Check for character filtering
- Test with simple commands first (whoami)

### Completion Checklist

- [ ] All 9 labs completed
- [ ] All 20 CTF flags captured
- [ ] Understand each OWASP category
- [ ] Can explain remediation for each vulnerability
- [ ] Practiced with browser DevTools
- [ ] Understand secure coding principles

## Troubleshooting

### MongoDB Connection Issues

If seed fails with authentication error:

```bash
# Check MongoDB is running
mongosh

# Verify connection string in .env
cat .env | grep MONGO

# Use local MongoDB if needed
MONGODB_URI=mongodb://localhost:27017/secure_learning_platform
```

### Port Already in Use

```bash
# Backend (port 3001)
lsof -ti:3001 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Multer Package Issues

```bash
cd express_backend
npm install multer@1.4.5-lts.1
mkdir -p uploads
chmod 755 uploads
```

### React Build Errors

```bash
cd react_frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### API Connection Errors

Check CORS and API base URL:
- Frontend: `REACT_APP_API_BASE=http://localhost:3001`
- Backend should allow CORS from frontend origin

## Advanced Topics

### Extending the Platform

- Add WebSocket-based vulnerabilities
- Implement GraphQL with injection flaws
- Add prototype pollution labs
- Create XXE (XML External Entity) challenges
- Build SSRF (Server-Side Request Forgery) labs

### Custom Vulnerability Categories

Create your own vulnerability types:
1. Add routes in `src/routes/vulnerable.js`
2. Implement controller in `src/controllers/vulnerableController.js`
3. Create frontend lab page in `src/pages/labs/`
4. Add to routing in `App.js`
5. Seed database with lab definition

---

**Happy Hacking! 🎓🔐**
