import { type FC, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import StraightenIcon from '@mui/icons-material/Straighten';
import PercentIcon from '@mui/icons-material/Percent';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import PaletteIcon from '@mui/icons-material/Palette';
import TuneIcon from '@mui/icons-material/Tune';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch } from '../state/configureStore';
import { setDbReady } from '../state/pageSlice';
import { getApi } from '../shared/api/restApi';

const DRAWER_WIDTH = 240;

const navItems = [
  { path: '/invoices', label: 'nav.invoices', icon: <ReceiptLongIcon /> },
  { path: '/quotes', label: 'nav.quotes', icon: <RequestQuoteIcon /> },
  { divider: true },
  { path: '/clients', label: 'nav.clients', icon: <PeopleIcon /> },
  { path: '/items', label: 'nav.items', icon: <InventoryIcon /> },
  { path: '/banks', label: 'nav.banks', icon: <AccountBalanceIcon /> },
  { path: '/businesses', label: 'nav.businesses', icon: <BusinessIcon /> },
  { divider: true },
  { path: '/categories', label: 'Categories', icon: <CategoryIcon /> },
  { path: '/units', label: 'Units', icon: <StraightenIcon /> },
  { path: '/taxes', label: 'Tax Slabs', icon: <PercentIcon /> },
  { path: '/currencies', label: 'Currencies', icon: <CurrencyExchangeIcon /> },
  { divider: true },
  { path: '/layouts', label: 'nav.layouts', icon: <ViewQuiltIcon /> },
  { path: '/style-profiles', label: 'nav.styleProfiles', icon: <PaletteIcon /> },
  { path: '/presets', label: 'nav.presets', icon: <TuneIcon /> },
  { path: '/reports', label: 'nav.reports', icon: <BarChartIcon /> },
  { divider: true },
  { path: '/settings', label: 'nav.settings', icon: <SettingsIcon /> }
];

export const AppLayout: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const api = getApi();
    await api.closeDb();
    localStorage.removeItem('billium_db');
    dispatch(setDbReady(false));
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar sx={{ justifyContent: 'center', gap: 1 }}>
        <img src="/billium logo.png" alt="Billium Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
          Billium
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item, index) => {
          if ('divider' in item) {
            return <Divider key={`divider-${index}`} sx={{ my: 0.5 }} />;
          }
          return (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path!);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 1,
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '20',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '30'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.label!)} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 1, mx: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t('nav.logout')} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH }
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: `1px solid ${theme.palette.divider}`
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default
        }}
      >
        {/* Mobile menu button */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, p: 1 }}>
          <IconButton onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
