// client.ts
import { treaty } from '@elysiajs/eden'
import type { BackendApp } from '../../../../backend/src'

// @ts-ignore
export const client = treaty<BackendApp>('localhost:3000') 

