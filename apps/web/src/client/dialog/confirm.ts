import type { ConfirmOptions } from 'material-ui-confirm'
import { confirm as muiConfirm } from 'material-ui-confirm'

export async function confirm(options: ConfirmOptions): Promise<'ok' | 'cancel'> {
  return muiConfirm(options)
    .then(() => 'ok' as const)
    .catch(() => 'cancel' as const)
}
