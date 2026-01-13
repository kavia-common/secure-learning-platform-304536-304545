require('dotenv').config();

const mongoose = require('mongoose');
const { resolveMongoUri } = require('../src/db/mongo');

const User = require('../src/models/User');
const Lab = require('../src/models/Lab');
const Hint = require('../src/models/Hint');

async function main() {
  const uri = resolveMongoUri();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  console.log(`Seeding database at ${uri}...`);

  // Create / upsert an admin user (intentionally weak password).
  await User.updateOne(
    { email: 'admin@example.com' },
    {
      $setOnInsert: {
        email: 'admin@example.com',
        password: 'admin',
        displayName: 'Admin',
        roles: ['admin'],
      },
    },
    { upsert: true }
  );

  // Create test users for IDOR lab
  await User.updateOne(
    { email: 'victim@example.com' },
    {
      $setOnInsert: {
        email: 'victim@example.com',
        password: 'victim123',
        displayName: 'Victim User',
        roles: ['user'],
      },
    },
    { upsert: true }
  );

  const labs = [
    {
      slug: 'level-1-stored-xss',
      title: 'Level 1: Stored XSS Attack',
      description: 'Learn how stored Cross-Site Scripting (XSS) works by exploiting a comment system that stores and displays user input without sanitization.',
      category: 'xss',
      difficulty: 'easy',
      estimatedMinutes: 15,
      objective: 'Post a comment containing JavaScript that executes an alert() when the page loads. The solution is to submit any script tag that triggers an alert.',
      remediation: 'Always sanitize user input on the server side. Use libraries like DOMPurify for HTML sanitization. Implement Content Security Policy (CSP) headers. Encode output when rendering user-generated content.',
      solutionCheck: {
        type: 'contains',
        value: '<script>',
        successMessage: 'Correct! You successfully exploited Stored XSS. Your script is now permanently stored and will execute for all users viewing the comments.',
        failureMessage: 'Try posting a comment with a <script> tag that executes JavaScript.',
      },
      isPublished: true,
      level: 1,
      owaspCategory: 'A03:2021 - Injection',
    },
    {
      slug: 'level-2-reflected-xss',
      title: 'Level 2: Reflected XSS Attack',
      description: 'Exploit reflected XSS by crafting a URL that includes malicious JavaScript in the query parameters.',
      category: 'xss',
      difficulty: 'easy',
      estimatedMinutes: 12,
      objective: 'Craft a search URL that causes JavaScript to execute when the search results are displayed. Submit a URL containing a script payload.',
      remediation: 'Never reflect user input directly in responses. Always encode output. Use templating engines that auto-escape by default. Validate and sanitize all query parameters.',
      solutionCheck: {
        type: 'contains',
        value: '<script>',
        successMessage: 'Correct! You exploited Reflected XSS by embedding malicious code in the URL that gets reflected back and executed.',
        failureMessage: 'Try adding a <script> tag to the search query parameter in the URL.',
      },
      isPublished: true,
      level: 2,
      owaspCategory: 'A03:2021 - Injection',
    },
    {
      slug: 'level-3-dom-xss',
      title: 'Level 3: DOM-based XSS Attack',
      description: 'Exploit client-side DOM manipulation that unsafely reads from window.location.hash and writes to innerHTML.',
      category: 'xss',
      difficulty: 'medium',
      estimatedMinutes: 15,
      objective: 'Use the URL fragment (hash) to inject JavaScript that executes in the DOM. The vulnerability is purely client-side.',
      remediation: 'Avoid using innerHTML with user-controlled data. Use textContent or createElement instead. If innerHTML is necessary, sanitize with DOMPurify. Never trust URL fragments.',
      solutionCheck: {
        type: 'contains',
        value: '<img src=x onerror=',
        successMessage: 'Correct! You exploited DOM XSS by manipulating the URL hash to inject executable code directly into the page DOM.',
        failureMessage: 'Try using an img tag with an onerror event in the URL hash.',
      },
      isPublished: true,
      level: 3,
      owaspCategory: 'A03:2021 - Injection',
    },
    {
      slug: 'level-4-nosql-injection',
      title: 'Level 4: NoSQL Injection',
      description: 'Bypass authentication by injecting MongoDB operators into the login request to manipulate the database query.',
      category: 'injection',
      difficulty: 'medium',
      estimatedMinutes: 20,
      objective: 'Login to the vulnerable endpoint without knowing a valid password by exploiting NoSQL injection. Use MongoDB operators like $ne.',
      remediation: 'Never pass user input directly into database queries. Use parameterized queries or ORMs. Validate input types strictly. Implement proper authentication logic.',
      solutionCheck: {
        type: 'contains',
        value: '$ne',
        successMessage: 'Correct! You bypassed authentication using NoSQL injection by manipulating the query with MongoDB operators.',
        failureMessage: 'Try sending {"email": {"$ne": null}, "password": {"$ne": null}} to bypass authentication.',
      },
      isPublished: true,
      level: 4,
      owaspCategory: 'A03:2021 - Injection',
    },
    {
      slug: 'level-5-broken-auth',
      title: 'Level 5: Broken Authentication',
      description: 'Exploit weak authentication mechanisms including predictable tokens, weak secrets, and insecure token storage.',
      category: 'authentication',
      difficulty: 'medium',
      estimatedMinutes: 18,
      objective: 'Identify and exploit weaknesses in the authentication system. Find the weak JWT secret or reuse expired tokens.',
      remediation: 'Use strong, random JWT secrets. Implement token expiration and refresh mechanisms. Store tokens securely (httpOnly cookies, not localStorage). Rate limit authentication attempts.',
      solutionCheck: {
        type: 'contains',
        value: 'dev-secret',
        successMessage: 'Correct! You discovered the weak JWT secret and can now forge authentication tokens.',
        failureMessage: 'Look for the JWT secret in environment variables or configuration files. It\'s set to a default value.',
      },
      isPublished: true,
      level: 5,
      owaspCategory: 'A07:2021 - Identification and Authentication Failures',
    },
    {
      slug: 'level-6-idor',
      title: 'Level 6: Insecure Direct Object Reference (IDOR)',
      description: 'Access other users\' profiles by manipulating the user ID parameter without proper authorization checks.',
      category: 'access-control',
      difficulty: 'easy',
      estimatedMinutes: 10,
      objective: 'Access another user\'s profile data by changing the userId parameter in the API request. Find the admin user\'s secret data.',
      remediation: 'Always verify that the authenticated user has permission to access the requested resource. Implement proper access control checks. Use indirect references or check ownership before returning data.',
      solutionCheck: {
        type: 'contains',
        value: 'admin',
        successMessage: 'Correct! You exploited IDOR to access data belonging to another user without authorization.',
        failureMessage: 'Try accessing different user IDs in the /api/vulnerable/user/:userId endpoint.',
      },
      isPublished: true,
      level: 6,
      owaspCategory: 'A01:2021 - Broken Access Control',
    },
    {
      slug: 'level-7-csrf',
      title: 'Level 7: Cross-Site Request Forgery (CSRF)',
      description: 'Perform unauthorized actions on behalf of an authenticated user by exploiting missing CSRF protections.',
      category: 'access-control',
      difficulty: 'medium',
      estimatedMinutes: 15,
      objective: 'Craft a malicious page that changes a user\'s email address without their knowledge when they visit it while authenticated.',
      remediation: 'Implement CSRF tokens for all state-changing operations. Use SameSite cookie attributes. Verify the Origin and Referer headers. Require re-authentication for sensitive actions.',
      solutionCheck: {
        type: 'contains',
        value: 'csrf',
        successMessage: 'Correct! You successfully exploited CSRF by creating a request that executes without user consent.',
        failureMessage: 'Create a form that automatically submits to /api/vulnerable/change-email when the page loads.',
      },
      isPublished: true,
      level: 7,
      owaspCategory: 'A01:2021 - Broken Access Control',
    },
    {
      slug: 'level-8-file-upload',
      title: 'Level 8: Unrestricted File Upload',
      description: 'Upload malicious files by bypassing non-existent file type validation and restrictions.',
      category: 'misconfiguration',
      difficulty: 'medium',
      estimatedMinutes: 12,
      objective: 'Upload an executable file (like a .html or .js file) that should normally be blocked. Execute code through the uploaded file.',
      remediation: 'Validate file types using both extension and MIME type checks. Store uploads outside the web root. Generate random filenames. Scan uploads with antivirus. Set proper file permissions.',
      solutionCheck: {
        type: 'contains',
        value: '.html',
        successMessage: 'Correct! You uploaded an executable file that could be used to attack other users or the server.',
        failureMessage: 'Try uploading a .html file with a script tag to the /api/vulnerable/upload endpoint.',
      },
      isPublished: true,
      level: 8,
      owaspCategory: 'A05:2021 - Security Misconfiguration',
    },
    {
      slug: 'level-9-command-injection',
      title: 'Level 9: Command Injection',
      description: 'Execute arbitrary system commands by injecting malicious input into a ping command execution.',
      category: 'injection',
      difficulty: 'hard',
      estimatedMinutes: 20,
      objective: 'Execute additional commands beyond ping by exploiting command injection. Use command chaining characters (;, &&, ||, |).',
      remediation: 'Never pass user input directly to system commands. Use parameterized APIs instead of shell commands. Validate input against strict allowlists. Run with minimal privileges. Use containers for isolation.',
      solutionCheck: {
        type: 'contains',
        value: ';',
        successMessage: 'Correct! You successfully chained commands to execute arbitrary code on the server. This is one of the most dangerous vulnerabilities.',
        failureMessage: 'Try using command chaining characters like ; or && to execute additional commands after ping.',
      },
      isPublished: true,
      level: 9,
      owaspCategory: 'A03:2021 - Injection',
    },
  ];

  const createdLabs = [];
  for (const lab of labs) {
    const doc = await Lab.findOneAndUpdate(
      { slug: lab.slug },
      { $set: lab },
      { upsert: true, new: true }
    );
    createdLabs.push(doc);
  }

  // Create hints for each lab
  const hintsData = {
    'level-1-stored-xss': [
      { order: 1, text: 'Try posting a comment with HTML tags. Notice they render as HTML, not text.' },
      { order: 2, text: 'The <script> tag can execute JavaScript. Try: <script>alert("XSS")</script>' },
      { order: 3, text: 'Your comment is stored in the database and displayed to all users - this is Stored XSS!' },
    ],
    'level-2-reflected-xss': [
      { order: 1, text: 'Look at the search results page. The search term from the URL is displayed on the page.' },
      { order: 2, text: 'Try adding HTML in the query parameter: ?q=<h1>Test</h1>' },
      { order: 3, text: 'Now try a script tag: ?q=<script>alert("XSS")</script>' },
    ],
    'level-3-dom-xss': [
      { order: 1, text: 'This lab reads from window.location.hash (the part after #) and writes it to innerHTML.' },
      { order: 2, text: 'Try adding #<img src=x> to the URL and see what happens.' },
      { order: 3, text: 'Use an onerror event: #<img src=x onerror="alert(\'XSS\')">' },
    ],
    'level-4-nosql-injection': [
      { order: 1, text: 'MongoDB queries can accept operators like $ne (not equal), $gt (greater than).' },
      { order: 2, text: 'Instead of a string, send an object: {"email": {"$ne": null}, "password": {"$ne": null}}' },
      { order: 3, text: 'This bypasses authentication because it finds any user where email and password are not null!' },
    ],
    'level-5-broken-auth': [
      { order: 1, text: 'Check the environment configuration. Look for JWT_SECRET or similar variables.' },
      { order: 2, text: 'The JWT secret is set to "dev-secret" by default in development mode.' },
      { order: 3, text: 'With the secret, you can forge JWTs using tools like jwt.io to impersonate any user.' },
    ],
    'level-6-idor': [
      { order: 1, text: 'The API endpoint /api/vulnerable/user/:userId accepts any MongoDB ObjectId.' },
      { order: 2, text: 'Try changing the userId to access other users. Look for admin@example.com\'s ID.' },
      { order: 3, text: 'There\'s no check to verify you own the profile you\'re requesting - that\'s IDOR!' },
    ],
    'level-7-csrf': [
      { order: 1, text: 'The /api/vulnerable/change-email endpoint accepts POST requests without CSRF token validation.' },
      { order: 2, text: 'Create an HTML form that automatically submits to this endpoint when the page loads.' },
      { order: 3, text: 'If a logged-in user visits your malicious page, their email will be changed without consent!' },
    ],
    'level-8-file-upload': [
      { order: 1, text: 'The upload endpoint doesn\'t validate file types or extensions.' },
      { order: 2, text: 'Try uploading a .html file with a <script> tag instead of an image.' },
      { order: 3, text: 'The file is saved in the uploads/ directory and could be executed by accessing it directly.' },
    ],
    'level-9-command-injection': [
      { order: 1, text: 'The ping endpoint executes: ping -c 4 <your-input>' },
      { order: 2, text: 'Use ; to chain commands: 127.0.0.1; ls -la' },
      { order: 3, text: 'Try: 127.0.0.1; cat /etc/passwd or 127.0.0.1 && whoami to execute additional commands.' },
    ],
  };

  for (const lab of createdLabs) {
    await Hint.deleteMany({ labId: lab._id });
    
    const labHints = hintsData[lab.slug] || [];
    if (labHints.length > 0) {
      await Hint.insertMany(labHints.map((h) => ({ ...h, labId: lab._id })));
    }
  }

  console.log('Seed complete - 9 vulnerability labs created with level progression!');
  console.log('CTF Side Quest: 20 flags hidden throughout the application.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
