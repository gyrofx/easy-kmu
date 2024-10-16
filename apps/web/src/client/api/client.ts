import { initClient } from '@ts-rest/core'
import { api } from '../../common/api/api'

export const apiClient = initClient(api, {
  baseUrl: window.location.origin,
  baseHeaders: {},
})
