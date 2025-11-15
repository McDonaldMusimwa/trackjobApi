import { cp } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const src = path.resolve('src/generated')
const dest = path.resolve('dist/generated')

async function main() {
  if (!existsSync(src)) {
    console.error('Prisma client not found at', src)
    process.exit(0)
  }

  // If the destination already exists (and may be locked by a running process), skip copying
  if (existsSync(dest)) {
    console.log('Prisma client already present at', dest, '- skipping copy')
    process.exit(0)
  }

  try {
    await cp(src, dest, { recursive: true })
    console.log('Copied prisma client from', src, 'to', dest)
  } catch (err) {
    console.error('Failed copying prisma client:', err)
    process.exit(1)
  }
}

main()
