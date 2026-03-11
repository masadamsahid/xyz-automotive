// client.ts
import { treaty } from '@elysiajs/eden'
import type { BackendApp } from '../../../../backend/src'

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'localhost:3000'

// @ts-ignore
export const client = treaty<BackendApp>(API_URL) 
