import type { Subprocess } from 'bun'

export type AnvilInstance = {
  rpcUrl: string
  port: number
  stop: () => void
}

export async function spawnAnvil(options: {
  forkUrl: string
  forkBlockNumber?: bigint | undefined
  chainId?: number | undefined
  autoImpersonate?: boolean | undefined
}): Promise<AnvilInstance> {
  const { forkUrl, forkBlockNumber, chainId, autoImpersonate = true } = options

  const args = ['--fork-url', forkUrl, '--port', '0', '--no-mining']

  if (forkBlockNumber !== undefined) {
    args.push('--fork-block-number', forkBlockNumber.toString())
  }

  if (chainId !== undefined) {
    args.push('--chain-id', chainId.toString())
  }

  if (autoImpersonate) {
    args.push('--auto-impersonate')
  }

  const proc = Bun.spawn(['anvil', ...args], {
    stdout: 'pipe',
    stderr: 'pipe',
  })

  const port = await detectPort(proc)

  return {
    rpcUrl: `http://127.0.0.1:${port}`,
    port,
    stop: () => proc.kill(),
  }
}

async function drainStderr(proc: Subprocess<'ignore', 'pipe', 'pipe'>): Promise<string> {
  const reader = proc.stderr.getReader()
  const decoder = new TextDecoder()
  let output = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      output += decoder.decode(value, { stream: true })
    }
  } catch {
  } finally {
    reader.releaseLock()
  }
  return output
}

async function detectPort(proc: Subprocess<'ignore', 'pipe', 'pipe'>): Promise<number> {
  const reader = proc.stdout.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const timeout = setTimeout(() => {
    proc.kill()
    throw new Error('Anvil failed to start within 30s')
  }, 30_000)

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        const stderr = await drainStderr(proc)
        throw new Error(`Anvil exited before listening.\n${stderr}`)
      }

      buffer += decoder.decode(value, { stream: true })

      const match = buffer.match(/Listening on (127\.0\.0\.1|0\.0\.0\.0):(\d+)/)
      if (match?.[2]) {
        return Number.parseInt(match[2], 10)
      }
    }
  } finally {
    clearTimeout(timeout)
    reader.releaseLock()
  }
}
