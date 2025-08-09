import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Package, 
  CreditCard, 
  TrendingUp, 
  UserPlus, 
  Coins, 
  Crown,
  Calendar,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Activity,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { userService } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface Analytics {
  totalUsers: number;
  todayUsers: number;
  weekUsers: number;
  monthUsers: number;
  totalCredits: number;
  avgCredits: number;
  usersWithCredits: number;
  adminUsers: number;
  recentActivity: Array<{ date: string; count: number }>;
  periods: {
    today: { users: number; percentage: number };
    week: { users: number; percentage: number };
    month: { users: number; percentage: number };
  };
  shopify: {
    totalOrders: number;
    todayOrders: number;
    weekOrders: number;
    monthOrders: number;
    totalRevenue: number;
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    avgOrderValue: number;
    conversionRate: number;
    abandonedCarts: number;
    totalCheckoutSessions: number;
    recentSales: Array<{ date: string; orders: number; revenue: number }>;
    periods: {
      today: { orders: number; revenue: number; percentage: number };
      week: { orders: number; revenue: number; percentage: number };
      month: { orders: number; revenue: number; percentage: number };
    };
  };
}

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load dashboard data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load analytics from database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPeriodStats = () => {
    if (!analytics) return null;
    
    switch (selectedPeriod) {
      case 'today':
        return {
          users: analytics.todayUsers,
          percentage: analytics.periods.today.percentage,
          label: 'Today'
        };
      case 'week':
        return {
          users: analytics.weekUsers,
          percentage: analytics.periods.week.percentage,
          label: 'This Week'
        };
      case 'month':
        return {
          users: analytics.monthUsers,
          percentage: analytics.periods.month.percentage,
          label: 'This Month'
        };
      case 'all':
        return {
          users: analytics.totalUsers,
          percentage: 100,
          label: 'All Time'
        };
    }
  };

  const periodStats = getPeriodStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground/70">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground/70">No data available</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: formatNumber(analytics.totalUsers),
      icon: <Users className="w-6 h-6" />,
      change: `+${analytics.todayUsers} today`,
      gradient: "from-blue-500 to-cyan-500",
      description: "Registered users"
    },
    {
      title: "Active Users",
      value: formatNumber(analytics.usersWithCredits),
      icon: <UserPlus className="w-6 h-6" />,
      change: `${Math.round((analytics.usersWithCredits / analytics.totalUsers) * 100)}% of total`,
      gradient: "from-purple-500 to-pink-500",
      description: "Users with credits"
    },
    {
      title: "Total Credits",
      value: formatNumber(analytics.totalCredits),
      icon: <Coins className="w-6 h-6" />,
      change: `${analytics.avgCredits} avg per user`,
      gradient: "from-orange-500 to-red-500",
      description: "Credits in circulation"
    },
    {
      title: "Admin Users",
      value: formatNumber(analytics.adminUsers),
      icon: <Crown className="w-6 h-6" />,
      change: `${Math.round((analytics.adminUsers / analytics.totalUsers) * 100)}% of total`,
      gradient: "from-green-500 to-emerald-500",
      description: "Administrator accounts"
    }
  ];

  const salesStats = [
    {
      title: "Total Orders",
      value: formatNumber(analytics.shopify.totalOrders),
      icon: <Package className="w-6 h-6" />,
      change: `+${analytics.shopify.todayOrders} today`,
      gradient: "from-indigo-500 to-purple-500",
      description: "Shopify orders"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(analytics.shopify.totalRevenue),
      icon: <CreditCard className="w-6 h-6" />,
      change: `+${formatCurrency(analytics.shopify.todayRevenue)} today`,
      gradient: "from-yellow-500 to-orange-500",
      description: "Total sales value"
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(analytics.shopify.avgOrderValue),
      icon: <TrendingUp className="w-6 h-6" />,
      change: `${analytics.shopify.conversionRate}% conversion`,
      gradient: "from-teal-500 to-cyan-500",
      description: "Average per order"
    },
    {
      title: "Checkout Sessions",
      value: formatNumber(analytics.shopify.totalCheckoutSessions),
      icon: <Activity className="w-6 h-6" />,
      change: `${analytics.shopify.abandonedCarts} abandoned`,
      gradient: "from-rose-500 to-pink-500",
      description: "Shopping sessions"
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-foreground/70 mt-2">
            Real-time analytics and insights from your database
          </p>
        </div>
        <Button onClick={fetchAnalytics} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {(['today', 'week', 'month', 'all'] as const).map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Button>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                  <p className="text-sm text-green-500">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Sales Stats Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Sales Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {salesStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 4) * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                    <p className="text-sm text-green-500">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Period Overview */}
      {periodStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {periodStats.label} Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">New Users</span>
                  <span className="text-2xl font-bold">{formatNumber(periodStats.users)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Percentage of Total</span>
                  <Badge variant="outline">{periodStats.percentage}%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                    <Badge variant="secondary">{activity.count} users</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Users with Credits</span>
                <span className="font-semibold">{analytics.usersWithCredits}</span>
              </div>
              <div className="flex justify-between">
                <span>Users without Credits</span>
                <span className="font-semibold">{analytics.totalUsers - analytics.usersWithCredits}</span>
              </div>
              <div className="flex justify-between">
                <span>Admin Users</span>
                <span className="font-semibold">{analytics.adminUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Today</span>
                <Badge variant="outline">+{analytics.todayUsers}</Badge>
              </div>
              <div className="flex justify-between">
                <span>This Week</span>
                <Badge variant="outline">+{analytics.weekUsers}</Badge>
              </div>
              <div className="flex justify-between">
                <span>This Month</span>
                <Badge variant="outline">+{analytics.monthUsers}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Credit Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Credits</span>
                <span className="font-semibold">{formatNumber(analytics.totalCredits)}</span>
              </div>
              <div className="flex justify-between">
                <span>Average per User</span>
                <span className="font-semibold">{analytics.avgCredits}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Users</span>
                <span className="font-semibold">{analytics.usersWithCredits}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shopify Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Sales Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Revenue</span>
                <span className="font-semibold">{formatCurrency(analytics.shopify.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Order Value</span>
                <span className="font-semibold">{formatCurrency(analytics.shopify.avgOrderValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate</span>
                <span className="font-semibold">{analytics.shopify.conversionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Order Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Today</span>
                <Badge variant="outline">+{analytics.shopify.todayOrders}</Badge>
              </div>
              <div className="flex justify-between">
                <span>This Week</span>
                <Badge variant="outline">+{analytics.shopify.weekOrders}</Badge>
              </div>
              <div className="flex justify-between">
                <span>This Month</span>
                <Badge variant="outline">+{analytics.shopify.monthOrders}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Today</span>
                <span className="font-semibold">{formatCurrency(analytics.shopify.todayRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>This Week</span>
                <span className="font-semibold">{formatCurrency(analytics.shopify.weekRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>This Month</span>
                <span className="font-semibold">{formatCurrency(analytics.shopify.monthRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User Registrations (Last 7 days)</span>
              <Badge variant="secondary">{analytics.recentActivity.length} days</Badge>
            </div>
            <div className="space-y-2">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                  <Badge variant="outline">+{activity.count} users</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Recent Sales Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sales (Last 7 days)</span>
              <Badge variant="secondary">{analytics.shopify.recentSales.length} days</Badge>
            </div>
            <div className="space-y-2">
              {analytics.shopify.recentSales.length > 0 ? (
                analytics.shopify.recentSales.map((sale, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <span className="text-sm">
                      {new Date(sale.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{sale.orders} orders</Badge>
                      <Badge variant="default">{formatCurrency(sale.revenue)}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No sales activity yet</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
