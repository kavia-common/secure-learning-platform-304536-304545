const Comment = require('../models/Comment');
const User = require('../models/User');
const Flag = require('../models/Flag');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// CTF Flags hidden throughout the system
const CTF_FLAGS = {
  // Hidden in comments (HTML source)
  'flag-1': 'CTF{st0r3d_xss_is_d4ng3r0us}',
  // Hidden in console logs
  'flag-2': 'CTF{r3fl3ct3d_xss_fr0m_url}',
  // Hidden in DOM manipulation
  'flag-3': 'CTF{d0m_xss_cl13nt_s1d3}',
  // Hidden in MongoDB query response
  'flag-4': 'CTF{n0sql_1nj3ct10n_byp4ss}',
  // Hidden in JWT payload
  'flag-5': 'CTF{w34k_jwt_s3cr3t_f0und}',
  // Hidden in IDOR user data
  'flag-6': 'CTF{1d0r_4cc3ss_c0ntr0l_f41l}',
  // Hidden in CSRF vulnerable response headers
  'flag-7': 'CTF{csrf_t0k3n_m1ss1ng}',
  // Hidden in uploaded file directory listing
  'flag-8': 'CTF{f1l3_upl04d_vuln3r4bl3}',
  // Hidden in command injection output
  'flag-9': 'CTF{c0mm4nd_1nj3ct10n_pwn3d}',
  // Additional hidden flags
  'flag-10': 'CTF{h1dd3n_1n_h34d3rs}',
  'flag-11': 'CTF{c00k13_s3cr3t_f0und}',
  'flag-12': 'CTF{s3ss10n_st0r4g3_l34k}',
  'flag-13': 'CTF{4p1_3ndp01nt_d1sc0v3ry}',
  'flag-14': 'CTF{v3rb0s3_3rr0r_m3ss4g3}',
  'flag-15': 'CTF{d3bug_m0d3_3n4bl3d}',
  'flag-16': 'CTF{s0urc3_c0d3_c0mm3nt}',
  'flag-17': 'CTF{r0b0ts_txt_s3cr3t}',
  'flag-18': 'CTF{sw4gg3r_l34k3d_1nf0}',
  'flag-19': 'CTF{g1t_r3p0_3xp0s3d}',
  'flag-20': 'CTF{m4st3r_h4ck3r_4ch13v3d}',
};

// PUBLIC_INTERFACE
async function getComments(req, res, next) {
  /**
   * Get all comments (VULNERABLE: Stored XSS - Lab 1)
   * OWASP A03:2021 - Injection
   * 
   * This endpoint returns raw comment data without sanitization.
   * Comments are stored with malicious scripts intact and will be
   * rendered directly on the client using dangerouslySetInnerHTML.
   */
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 }).limit(100);
    
    // CTF FLAG #1 hidden in response header
    res.setHeader('X-Flag-Hint', 'CTF flags are hidden everywhere!');
    
    return res.status(200).json({
      status: 'ok',
      comments,
      // CTF FLAG #16 hidden in response
      debug: '<!-- CTF{s0urc3_c0d3_c0mm3nt} -->',
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function postComment(req, res, next) {
  /**
   * Post a comment (VULNERABLE: Stored XSS - Lab 1)
   * OWASP A03:2021 - Injection
   * 
   * NO INPUT SANITIZATION - Accepts raw HTML/JavaScript
   * Stores malicious content directly in database
   * This allows persistent XSS attacks affecting all users who view comments
   */
  try {
    const { name, comment } = req.body || {};
    
    // VULNERABILITY: No sanitization, validation, or encoding
    const newComment = await Comment.create({
      name: name || 'Anonymous',
      comment: comment || '',
      ipAddress: req.ip || '',
    });
    
    return res.status(201).json({
      status: 'ok',
      comment: newComment,
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function search(req, res, next) {
  /**
   * Search endpoint (VULNERABLE: Reflected XSS - Lab 2)
   * OWASP A03:2021 - Injection
   * 
   * Returns the search query directly in response without sanitization.
   * Client will render this in the DOM, allowing script execution.
   */
  try {
    const query = req.query.q || '';
    
    // VULNERABILITY: Search term reflected without sanitization
    // Fake search results
    const results = [
      { id: 1, title: 'Sample Result 1', description: 'Description 1' },
      { id: 2, title: 'Sample Result 2', description: 'Description 2' },
    ];
    
    // CTF FLAG #10 hidden in custom header
    res.setHeader('X-Debug-Mode', 'CTF{h1dd3n_1n_h34d3rs}');
    
    return res.status(200).json({
      status: 'ok',
      query, // VULNERABLE: Reflected without encoding
      results,
      message: `Search results for: ${query}`, // VULNERABLE
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function loginNoSQL(req, res, next) {
  /**
   * NoSQL Injection vulnerable login (VULNERABLE - Lab 4)
   * OWASP A03:2021 - Injection
   * 
   * Directly passes req.body into MongoDB query without validation.
   * Allows injection of MongoDB operators like $ne, $gt, etc.
   * Example attack: {"email": {"$ne": null}, "password": {"$ne": null}}
   */
  try {
    const { email, password } = req.body || {};
    
    // VULNERABILITY: Direct query with user input (NoSQL Injection)
    // This allows operators like $ne, $gt, $regex to bypass authentication
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
        // CTF FLAG #14 in verbose error
        debug: 'Query: ' + JSON.stringify({ email, password }),
      });
    }
    
    // CTF FLAG #4 hidden in successful login
    return res.status(200).json({
      status: 'ok',
      message: 'Login successful via NoSQL endpoint',
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
      },
      flag: 'CTF{n0sql_1nj3ct10n_byp4ss}',
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function getUserProfile(req, res, next) {
  /**
   * Get user profile (VULNERABLE: IDOR - Lab 6)
   * OWASP A01:2021 - Broken Access Control
   * 
   * NO AUTHORIZATION CHECK - Any authenticated user can access
   * any other user's profile by changing the userId parameter.
   */
  try {
    const { userId } = req.params;
    
    // VULNERABILITY: No check if req.user._id === userId
    // Any authenticated user can view any other user's data
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    // Intentionally expose sensitive data
    return res.status(200).json({
      status: 'ok',
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        roles: user.roles,
        createdAt: user.createdAt,
        // CTF FLAG #6 for specific user
        secretData: user.email === 'admin@example.com' ? 'CTF{1d0r_4cc3ss_c0ntr0l_f41l}' : null,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function changeEmail(req, res, next) {
  /**
   * Change email (VULNERABLE: CSRF - Lab 7)
   * OWASP A01:2021 - Broken Access Control
   * 
   * NO CSRF TOKEN VALIDATION - State-changing operation without
   * protection against cross-site request forgery.
   */
  try {
    const { newEmail } = req.body || {};
    
    // VULNERABILITY: No CSRF token check
    // An attacker can craft a malicious page that submits this form
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email: newEmail },
      { new: true }
    );
    
    // CTF FLAG #7 in response header
    res.setHeader('X-CSRF-Protection', 'Disabled - CTF{csrf_t0k3n_m1ss1ng}');
    
    return res.status(200).json({
      status: 'ok',
      message: 'Email changed successfully',
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function uploadFile(req, res, next) {
  /**
   * Upload file (VULNERABLE: Unrestricted File Upload - Lab 8)
   * OWASP A05:2021 - Security Misconfiguration
   * 
   * NO FILE TYPE VALIDATION - Allows upload of any file type
   * including executable scripts (.js, .html, .php, etc.)
   */
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }
    
    // VULNERABILITY: No file type validation
    // Files saved with original name in public directory
    const filePath = `/uploads/${req.file.filename}`;
    
    // CTF FLAG #8 in directory listing hint
    const uploadsDir = path.join(__dirname, '../../uploads');
    let directoryHint = '';
    try {
      const files = fs.readdirSync(uploadsDir);
      directoryHint = 'Files in directory: ' + files.join(', ');
    } catch (e) {
      directoryHint = 'Could not read directory';
    }
    
    return res.status(200).json({
      status: 'ok',
      message: 'File uploaded successfully',
      filePath,
      filename: req.file.filename,
      // CTF FLAG #8
      flag: 'CTF{f1l3_upl04d_vuln3r4bl3}',
      debug: directoryHint,
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function ping(req, res, next) {
  /**
   * Ping command (VULNERABLE: Command Injection - Lab 9)
   * OWASP A03:2021 - Injection
   * 
   * UNSANITIZED INPUT TO SYSTEM COMMAND - Allows arbitrary
   * command execution through command chaining (;, &&, ||, |)
   * 
   * WARNING: This is extremely dangerous. Only for isolated learning environments.
   */
  try {
    const { host } = req.body || {};
    
    if (!host) {
      return res.status(400).json({ status: 'error', message: 'Host parameter required' });
    }
    
    // VULNERABILITY: Direct command execution with user input
    // Allows command injection via: 127.0.0.1; cat /etc/passwd
    const command = `ping -c 4 ${host}`;
    
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      // CTF FLAG #9 in command output
      const output = stdout + stderr;
      const flagHint = '\n\n# CTF{c0mm4nd_1nj3ct10n_pwn3d}';
      
      return res.status(200).json({
        status: 'ok',
        command, // Expose the executed command (bad practice)
        output: output + flagHint,
        error: error ? error.message : null,
      });
    });
  } catch (err) {
    return next(err);
  }
}

// PUBLIC_INTERFACE
async function submitFlag(req, res, next) {
  /**
   * Submit a CTF flag for validation
   */
  try {
    const { flagId } = req.params;
    const { flag } = req.body || {};
    
    const expectedFlag = CTF_FLAGS[flagId];
    
    if (!expectedFlag) {
      return res.status(404).json({
        status: 'error',
        message: 'Flag ID not found',
      });
    }
    
    const correct = flag === expectedFlag;
    
    if (correct) {
      // Save flag capture to user progress
      await Flag.create({
        userId: req.user._id,
        flagId,
        flag,
        capturedAt: new Date(),
      });
    }
    
    return res.status(200).json({
      status: 'ok',
      correct,
      message: correct ? 'Correct flag! Well done!' : 'Incorrect flag. Keep searching!',
      flagId,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getComments,
  postComment,
  search,
  loginNoSQL,
  getUserProfile,
  changeEmail,
  uploadFile,
  ping,
  submitFlag,
};
