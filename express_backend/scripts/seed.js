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

  const labs = [
    {
      slug: 'weak-auth-login',
      title: 'Weak Authentication: Plaintext Passwords',
      description: 'Demonstrates intentionally weak password handling and auth patterns.',
      category: 'authentication',
      difficulty: 'easy',
      estimatedMinutes: 10,
      objective: 'Submit the correct "solution" string to pass this lab.',
      remediation: 'Use proper password hashing (bcrypt/argon2), rate limiting, and MFA where appropriate.',
      solutionCheck: {
        type: 'exact',
        value: 'i-understand-plaintext-is-bad',
        successMessage: 'Correct. You acknowledged the weakness.',
        failureMessage: 'Try again: read the objective carefully.',
      },
      isPublished: true,
    },
    {
      slug: 'basic-solution-check',
      title: 'Solution Check Demo: Contains Match',
      description: 'Demonstrates server-side checks using a contains match.',
      category: 'general',
      difficulty: 'easy',
      estimatedMinutes: 5,
      objective: 'Submit an answer that includes the phrase "flag{demo}".',
      remediation: 'Server-side checks should be robust and avoid leaking secrets.',
      solutionCheck: {
        type: 'contains',
        value: 'flag{demo}',
        successMessage: 'Nice. Contains check passed.',
        failureMessage: 'Your answer did not include the expected phrase.',
      },
      isPublished: true,
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

  // Replace hints for the seeded labs (simple approach).
  for (const lab of createdLabs) {
    await Hint.deleteMany({ labId: lab._id });

    const labHints = lab.slug === 'weak-auth-login'
      ? [
          { order: 1, text: 'This lab uses a simple exact-match solution check.' },
          { order: 2, text: 'The expected solution is a single string (see the objective wording).' },
        ]
      : [
          { order: 1, text: 'Your submission must contain a specific substring.' },
          { order: 2, text: 'Try including: flag{demo}' },
        ];

    await Hint.insertMany(labHints.map((h) => ({ ...h, labId: lab._id })));
  }

  console.log('Seed complete.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
