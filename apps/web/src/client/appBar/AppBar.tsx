import { Logout, Settings } from '@mui/icons-material'
import AdbIcon from '@mui/icons-material/Adb'
import InfoIcon from '@mui/icons-material/Info'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar as MuiAppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import { useRouter } from '@/client/router/useRouter'
import { type MouseEvent, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { routes } from '@/client/router/routes'
import { useSession } from '@/client/auth/AuthProvider'

const pages = [routes.invoice, routes.contacts]

export function AppBar() {
  return (
    <MuiAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DesktopLayout />
          <MobileLayout />
        </Toolbar>
      </Container>
    </MuiAppBar>
  )
}

function DesktopLayout() {
  return (
    <>
      <TitleDesktop />
      <TabsMd />
    </>
  )
}

function MobileLayout() {
  return (
    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
      <MenuMobile />
      <TitleMobile />
    </Box>
  )
}

function TabsMd() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const router = useRouter()
  const session = useSession()
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const openSettings = () => {
    router.navigateToSettings()
    handleClose()
  }
  const openInfo = () => {
    router.navigateToAbout()
    handleClose()
  }

  const handleLogout = () => {
    // logout({ logoutParams: { returnTo: window.location.origin } })
    window.location.href = '/auth/logout'
  }

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      {pages.map(({ title, path }) => (
        <TabButton key={path} title={title} path={path} />
      ))}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose} disabled>
              <Avatar /> Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={openSettings}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={openInfo}>
              <ListItemIcon>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              Info
            </MenuItem>
            <MenuItem onClick={handleLogout} disabled={!session}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </>
      </Box>
    </Box>
  )
}

function TabButton(props: { title: string; path: string }) {
  const { title, path } = props

  const isSelected = useLocation().pathname.startsWith(path)
  const fontWeight = isSelected ? 'bold' : 'normal'

  return (
    <Button
      key={title}
      component={NavLink}
      to={path}
      sx={{ my: 2, color: 'white', display: 'block', fontWeight }}
    >
      {title}
    </Button>
  )
}

function MenuMobile() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex' }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {pages.map(({ title, path }) => (
          <MenuItem key={title} onClick={handleCloseNavMenu}>
            <Link component={NavLink} to={path}>
              {title}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

function TitleDesktop() {
  return (
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="/"
      sx={{
        mr: 2,
        display: { xs: 'none', md: 'flex' },
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      W
    </Typography>
  )
}

function TitleMobile() {
  return (
    <>
      <AdbIcon sx={{ display: 'flex', mr: 1 }} />
      <Typography
        variant="h5"
        noWrap
        component="a"
        href=""
        sx={{
          mr: 2,
          display: { xs: 'flex', md: 'none' },
          flexGrow: 1,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        W
      </Typography>
    </>
  )
}
