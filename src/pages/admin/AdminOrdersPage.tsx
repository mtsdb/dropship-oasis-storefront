
import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Types
interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  customerName: string;
  email: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

// Mock orders
const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    date: "2023-05-10",
    customerName: "John Doe",
    email: "john@example.com",
    total: 89.98,
    status: "delivered",
    items: [
      {
        id: "1",
        productName: "Wireless Earbuds",
        price: 59.99,
        quantity: 1,
      },
      {
        id: "6",
        productName: "Wireless Charging Pad",
        price: 24.99,
        quantity: 1,
      },
    ],
    shippingAddress: {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
  },
  {
    id: "ORD-1002",
    date: "2023-05-12",
    customerName: "Jane Smith",
    email: "jane@example.com",
    total: 129.99,
    status: "shipped",
    items: [
      {
        id: "2",
        productName: "Smart Watch",
        price: 129.99,
        quantity: 1,
      },
    ],
    shippingAddress: {
      address: "456 Elm St",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
    },
  },
  {
    id: "ORD-1003",
    date: "2023-05-15",
    customerName: "Bob Johnson",
    email: "bob@example.com",
    total: 79.98,
    status: "processing",
    items: [
      {
        id: "3",
        productName: "Portable Bluetooth Speaker",
        price: 49.99,
        quantity: 1,
      },
      {
        id: "4",
        productName: "Phone Camera Lens Kit",
        price: 29.99,
        quantity: 1,
      },
    ],
    shippingAddress: {
      address: "789 Oak St",
      city: "Chicago",
      state: "IL",
      zipCode: "60007",
    },
  },
  {
    id: "ORD-1004",
    date: "2023-05-17",
    customerName: "Sarah Williams",
    email: "sarah@example.com",
    total: 39.99,
    status: "pending",
    items: [
      {
        id: "5",
        productName: "Laptop Stand",
        price: 39.99,
        quantity: 1,
      },
    ],
    shippingAddress: {
      address: "101 Pine St",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
    },
  },
  {
    id: "ORD-1005",
    date: "2023-05-20",
    customerName: "Michael Brown",
    email: "michael@example.com",
    total: 149.97,
    status: "cancelled",
    items: [
      {
        id: "6",
        productName: "Wireless Charging Pad",
        price: 24.99,
        quantity: 1,
      },
      {
        id: "2",
        productName: "Smart Watch",
        price: 129.99,
        quantity: 1,
      },
    ],
    shippingAddress: {
      address: "202 Maple St",
      city: "Boston",
      state: "MA",
      zipCode: "02108",
    },
  },
];

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "processing":
      return "bg-blue-500 hover:bg-blue-600";
    case "shipped":
      return "bg-indigo-500 hover:bg-indigo-600";
    case "delivered":
      return "bg-green-500 hover:bg-green-600";
    case "cancelled":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Simulate loading data from API
    const fetchOrders = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(MOCK_ORDERS);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Update the selected order if it's open in the dialog
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer name, or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) =>
                        handleStatusChange(order.id, value as Order["status"])
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <Badge
                          className={`${getStatusColor(order.status)} text-white capitalize`}
                        >
                          {order.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="space-x-1"
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                          <DialogDescription>
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <h3 className="font-medium">Customer Information</h3>
                              <p className="text-sm">
                                <span className="font-medium">Name:</span> {selectedOrder.customerName}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Email:</span> {selectedOrder.email}
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-medium">Shipping Address</h3>
                              <p className="text-sm">{selectedOrder.shippingAddress.address}</p>
                              <p className="text-sm">
                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-medium">Order Status</h3>
                              <Select
                                defaultValue={selectedOrder.status}
                                onValueChange={(value) =>
                                  handleStatusChange(selectedOrder.id, value as Order["status"])
                                }
                              >
                                <SelectTrigger>
                                  <Badge
                                    className={`${getStatusColor(selectedOrder.status)} text-white capitalize`}
                                  >
                                    {selectedOrder.status}
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-medium">Order Items</h3>
                              <div className="space-y-4">
                                {selectedOrder.items.map((item) => (
                                  <div key={item.id} className="flex justify-between text-sm">
                                    <div>
                                      <p className="font-medium">{item.productName}</p>
                                      <p className="text-gray-500">
                                        ${item.price.toFixed(2)} x {item.quantity}
                                      </p>
                                    </div>
                                    <p className="font-medium">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between font-bold">
                                <p>Total</p>
                                <p>${selectedOrder.total.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
