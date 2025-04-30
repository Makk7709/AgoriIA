import { vi } from 'vitest'

const INTERNALS = Symbol('NextRequestInternals')

interface RequestInternals {
  cookies: Map<string, string>
  geo: {
    city: string
    country: string
    region: string
    latitude: string
    longitude: string
  }
  ip: string
  ua: string
  url: URL
}

export class NextRequest extends Request {
  nextUrl: URL
  cookies: {
    get: ReturnType<typeof vi.fn>
    getAll: ReturnType<typeof vi.fn>
    set: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }
  geo: {
    city: string
    country: string
    region: string
    latitude: string
    longitude: string
  }
  ip: string
  ua: string
  [INTERNALS]: RequestInternals
  page: {
    name: string
    params: Record<string, unknown>
  }

  constructor(input: string | URL, init?: RequestInit) {
    super(input, init)
    this.nextUrl = new URL(this.url)
    this.cookies = {
      get: vi.fn(),
      getAll: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    }
    this.geo = {
      city: '',
      country: '',
      region: '',
      latitude: '',
      longitude: '',
    }
    this.ip = ''
    this.ua = ''
    this[INTERNALS] = {
      cookies: new Map(),
      geo: this.geo,
      ip: this.ip,
      ua: this.ua,
      url: this.nextUrl,
    }
    this.page = {
      name: '',
      params: {},
    }
  }
}

export class NextResponse extends Response {
  static redirect(url: string | URL) {
    return new NextResponse(null, {
      status: 307,
      headers: { Location: url.toString() },
    })
  }

  static json(data: any) {
    return new NextResponse(JSON.stringify(data), {
      headers: { 'content-type': 'application/json' },
    })
  }
}

export const cookies = vi.fn(() => ({
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
})) 