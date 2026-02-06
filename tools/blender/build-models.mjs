import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const blenderBinary = process.env.BLENDER_PATH || 'blender'
const scripts = ['monolith.py', 'ribbon.py', 'orb-cluster.py']

const check = spawnSync(blenderBinary, ['--version'], { stdio: 'ignore' })
if (check.error) {
  console.error('Blender not found. Install Blender or set BLENDER_PATH to the binary.')
  process.exit(1)
}

for (const script of scripts) {
  const scriptPath = path.join(__dirname, script)
  const result = spawnSync(blenderBinary, ['-b', '-P', scriptPath], { stdio: 'inherit' })
  if (result.error) {
    console.error(`Failed to run ${script}.`)
    process.exit(1)
  }
  if (result.status !== 0) {
    console.error(`Blender exited with code ${result.status} while running ${script}.`)
    process.exit(result.status ?? 1)
  }
}
