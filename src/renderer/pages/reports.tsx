import { type FC } from 'react';
import { Typography, Box, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { useReportsRetrieve } from '../shared/hooks/reports/useReportsRetrieve';
import { centsToDecimal } from '../shared/utils/financials';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const COLORS = ['#4CAF50', '#FFC107', '#F44336', '#2196F3', '#9C27B0'];

const formatMoney = (cents: string | number, sym = '') => {
  const amount = centsToDecimal(cents);
  return `${sym}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const ReportsPage: FC = () => {
  const { data: stats, isLoading } = useReportsRetrieve();

  const sym = '₹'; // Default currency symbol

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Typography color="error">Failed to load dashboard statistics.</Typography>;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedRevenue = stats.revenueByMonth.map(m => ({
    month: monthNames[parseInt(m.month, 10) - 1],
    revenue: Number(m.revenueCents) / 100
  }));

  const pieData = stats.invoicesByStatus.map(s => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s.count
  }));

  return (
    <Box sx={{ pb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Business Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <MonetizationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="subtitle2" textTransform="uppercase">Total Revenue (Paid)</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {formatMoney(stats.totalRevenueCents, sym)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalanceWalletIcon color="error" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="subtitle2" textTransform="uppercase">Outstanding Balance</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {formatMoney(stats.outstandingBalanceCents, sym)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <ReceiptLongIcon color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="subtitle2" textTransform="uppercase">Total Invoices</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {stats.invoiceCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Revenue Trend */}
        <Grid item xs={12} md={8}>
          <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Revenue Over Time (This Year)
              </Typography>
              <Box sx={{ width: '100%', height: 350, mt: 2 }}>
                {formattedRevenue.length > 0 ? (
                  <ResponsiveContainer>
                    <LineChart data={formattedRevenue} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fill: '#888' }} />
                      <YAxis tick={{ fill: '#888' }} tickFormatter={(value) => `${sym}${value}`} />
                      <RechartsTooltip 
                        formatter={(value: number) => [`${sym}${value.toFixed(2)}`, 'Revenue']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#4CAF50" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color="text.secondary">No revenue data for this year.</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Invoice Status Distribution */}
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Invoice Status
              </Typography>
              <Box sx={{ width: '100%', height: 350, mt: 2 }}>
                {pieData.length > 0 ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color="text.secondary">No invoices found.</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
