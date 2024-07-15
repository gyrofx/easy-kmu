import { Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import { gitRef, gitBranch, buildTime } from '@/buildInfo'
import { t } from '@/client/i18n/t'
import { routes } from '@/client/router/routes'
import { useRouter } from '@/client/router/useRouter'

export function About() {
  const router = useRouter()

  return (
    <Dialog open onClose={router.navigateToHome}>
      <DialogTitle>{routes.about.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>
            {t().about.gitRef}: {gitRef}
          </Typography>
          <Typography>
            {t().about.gitBranch}: {gitBranch}
          </Typography>
          <Typography>
            {t().about.buildTime}: {buildTime}
          </Typography>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
