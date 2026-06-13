const PREFIX = 'hk_pro_'

export function persist<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
  } catch {
    // Storage might be full or unavailable
  }
}

export function retrieve<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(`${PREFIX}${key}`)
  } catch {
    // noop
  }
}
