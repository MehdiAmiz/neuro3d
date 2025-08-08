import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// Dev-only component; database direct access removed in unified architecture
import { User, Eye, EyeOff, Trash2, RefreshCw } from "lucide-react";

export const DatabaseViewer = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await db.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await db.deleteUser(userId);
      await loadUsers(); // Reload the list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <motion.div
      className="fixed bottom-4 right-4 w-80 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Database Users</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPasswords(!showPasswords)}
            className="p-1"
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadUsers}
            disabled={isLoading}
            className="p-1"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {users.length === 0 ? (
          <p className="text-foreground/60 text-sm text-center py-4">No users found</p>
        ) : (
          users.map((user) => (
            <motion.div
              key={user.id}
              className="bg-white/5 rounded-lg p-3 border border-white/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-foreground font-medium text-sm">{user.name}</p>
                  <p className="text-foreground/60 text-xs">{user.email}</p>
                  {showPasswords && (
                    <p className="text-foreground/40 text-xs mt-1">Password: {user.password}</p>
                  )}
                  <p className="text-foreground/40 text-xs mt-1">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteUser(user.id)}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-foreground/60 text-xs">
          Total Users: {users.length}
        </p>
        <p className="text-foreground/40 text-xs mt-1">
          Test user: test@example.com / password123
        </p>
      </div>
    </motion.div>
  );
}; 