import { useAsync } from 'react-use'

type ApiRoutePath = string

export function useGet<ResB>(url: ApiRoutePath) {
  return useAsync(() => get<ResB>(url), [url])
}

export async function get<ResB>(url: ApiRoutePath, searchParams?: URLSearchParams): Promise<ResB> {
  const response = await getRaw(url, searchParams)
  return response.json()
}

export async function getRaw(url: ApiRoutePath, searchParams?: URLSearchParams) {
  const response = await fetch(searchParams ? `${url}?${searchParams.toString()}` : url)
  if (!response.ok) {
    throw await responseToError(response)
  }
  return response
}

export async function postWithoutResult<ReqB>(url: ApiRoutePath, body: ReqB | undefined = undefined) {
  await postRaw<ReqB>(url, body)
}

export async function post<ReqB, ResB>(
  url: ApiRoutePath,
  body: ReqB | undefined = undefined,
): Promise<ResB> {
  const response = await postRaw<ReqB>(url, body)
  return response.json()
}

export async function postRaw<ReqB>(url: ApiRoutePath, body: ReqB | undefined = undefined) {
  const response = await fetch(url, postOptions(body))
  if (!response.ok) {
    throw await responseToError(response)
  }
  return response
}

export async function put<ReqB>(url: ApiRoutePath, body: ReqB | undefined = undefined) {
  const response = await fetch(url, putOptions(body))
  if (!response.ok) {
    throw await responseToError(response)
  }
  return response
}

function postOptions(body: unknown): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

function putOptions(body: unknown): RequestInit {
  return {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export async function responseToError(res: Response) {
  const text = await res.text()
  const errorText = res.statusText || text || 'Unknown error'
  if (!text) return new Error(errorText)
  try {
    const body = JSON.parse(text)
    if ('error' in body && typeof body.error === 'string') {
      return new Error(`${res.statusText || 'Unknown error'}: ${body.error}`)
    }
    return new Error(errorText)
  } catch {
    return new Error(errorText)
  }
}
