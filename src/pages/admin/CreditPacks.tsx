import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AdminCreditPacks = () => {
  const [creditPacks, setCreditPacks] = useState([
    {
      id: "1",
      name: "Starter",
      credits: 3000,
      price: 14,
      popular: false,
      shopifyId: "42665373925454",
      status: "active"
    },
    {
      id: "2",
      name: "Professional",
      credits: 5000,
      price: 20,
      popular: true,
      shopifyId: "42665410035790",
      status: "active"
    },
    {
      id: "3",
      name: "Enterprise",
      credits: 20000,
      price: 50,
      popular: false,
      shopifyId: "42665416851534",
      status: "active"
    }
  ]);

  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPack, setNewPack] = useState({
    name: "",
    credits: 0,
    price: 0,
    shopifyId: "",
    popular: false
  });

  const handleAddPack = () => {
    setCreditPacks([...creditPacks, { ...newPack, id: String(Date.now()), status: "active" }]);
    setIsAddDialogOpen(false);
    setNewPack({ name: "", credits: 0, price: 0, shopifyId: "", popular: false });
    toast({
      title: "Credit Pack Added",
      description: "New credit pack has been successfully added.",
    });
  };

  const handleDeletePack = (packId: string) => {
    setCreditPacks(creditPacks.filter(pack => pack.id !== packId));
    toast({
      title: "Credit Pack Deleted",
      description: "Credit pack has been successfully deleted.",
    });
  };

  const handleToggleStatus = (packId: string) => {
    setCreditPacks(creditPacks.map(pack => 
      pack.id === packId 
        ? { ...pack, status: pack.status === "active" ? "inactive" : "active" }
        : pack
    ));
    toast({
      title: "Status Updated",
      description: "Credit pack status has been updated.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Credit Packs Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Credit Pack
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Credit Pack</DialogTitle>
              <DialogDescription>
                Create a new credit pack with the following details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input
                  value={newPack.name}
                  onChange={(e) => setNewPack({ ...newPack, name: e.target.value })}
                  placeholder="Enter pack name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Credits</label>
                <Input
                  type="number"
                  value={newPack.credits}
                  onChange={(e) => setNewPack({ ...newPack, credits: Number(e.target.value) })}
                  placeholder="Enter credits amount"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Price ($)</label>
                <Input
                  type="number"
                  value={newPack.price}
                  onChange={(e) => setNewPack({ ...newPack, price: Number(e.target.value) })}
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Shopify Product ID</label>
                <Input
                  value={newPack.shopifyId}
                  onChange={(e) => setNewPack({ ...newPack, shopifyId: e.target.value })}
                  placeholder="Enter Shopify product ID"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={newPack.popular}
                  onChange={(e) => setNewPack({ ...newPack, popular: e.target.checked })}
                />
                <label htmlFor="popular">Mark as Popular</label>
              </div>
              <Button onClick={handleAddPack} className="w-full">
                Add Credit Pack
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <div className="rounded-lg overflow-hidden border border-white/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Shopify ID</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditPacks.map((pack) => (
                <TableRow key={pack.id}>
                  <TableCell>{pack.name}</TableCell>
                  <TableCell>{pack.credits.toLocaleString()}</TableCell>
                  <TableCell>${pack.price}</TableCell>
                  <TableCell>{pack.shopifyId}</TableCell>
                  <TableCell>
                    <Badge variant={pack.popular ? "default" : "outline"}>
                      {pack.popular ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={pack.status === "active" ? "success" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(pack.id)}
                    >
                      {pack.status}
                    </Badge>
                  </TableCell>
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
                          Edit Pack
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleDeletePack(pack.id)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete Pack
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
