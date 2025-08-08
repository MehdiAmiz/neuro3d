import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, CreditCard, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: <Users className="w-6 h-6" />,
      change: "+12%",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Active Subscriptions",
      value: "856",
      icon: <Package className="w-6 h-6" />,
      change: "+23%",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Total Revenue",
      value: "$12,345",
      icon: <CreditCard className="w-6 h-6" />,
      change: "+18%",
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Credits Sold",
      value: "45,678",
      icon: <TrendingUp className="w-6 h-6" />,
      change: "+28%",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <span className="text-sm text-green-500">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add more dashboard content here */}
    </div>
  );
};
