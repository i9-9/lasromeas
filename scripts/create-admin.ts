/**
 * Creates the first admin user using Payload's local API.
 * Run: npx tsx scripts/create-admin.ts
 */
import { getPayload } from 'payload'
import config from '../payload.config'

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'users', limit: 1 })
  if (existing.totalDocs > 0) {
    console.log('✓ Admin user already exists:', existing.docs[0].email)
    process.exit(0)
  }

  const user = await payload.create({
    collection: 'users',
    data: {
      email: 'admin@lasromeas.com',
      password: 'Admin1234!',
      role: 'admin',
      displayName: 'Admin',
    },
  })

  console.log('✓ Admin user created:', user.email)
  process.exit(0)
}

main().catch((e) => {
  console.error('Error:', e.message)
  process.exit(1)
})
