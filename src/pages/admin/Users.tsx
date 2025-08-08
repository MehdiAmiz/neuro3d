import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Edit, Trash, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { userService } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load users from database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted from the database."
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddCredits = async (userId: string, amount: number) => {
    try {
      await userService.addCredits(userId, amount);
      // Refresh the users list to get updated data
      await fetchUsers();
      toast({
        title: "Credits Added",
        description: `${amount} credits have been added to the user's account.`
      });
    } catch (error) {
      console.error('Failed to add credits:', error);
      toast({
        title: "Error",
        description: "Failed to add credits. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground/70">Loading users from database...</p>
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
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-foreground/70 mt-2">
            Manage {users.length} user{users.length !== 1 ? 's' : ''} in the database
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border border-white/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-foreground/70">
                    {searchTerm ? 'No users found matching your search.' : 'No users found in database.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {user.credits} credits
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_admin ? "default" : "outline"}>
                        {user.is_admin ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddCredits(user.id, 100)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add 100 Credits
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddCredits(user.id, 500)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add 500 Credits
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};