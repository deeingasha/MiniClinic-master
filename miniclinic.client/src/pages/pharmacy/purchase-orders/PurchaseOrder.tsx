import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Package,
  Send,
  Truck,
  User,
} from "lucide-react";
import { orders } from "@/data/data";
import { OrderModel } from "@/types";
import PurchaseOrderModal from "./AddPurchaseOrder";

function PurchaseOrder() {
  const { pk } = useParams<{ pk: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch order details
    setLoading(true);
    setTimeout(() => {
      const foundOrder = orders.find((o) => o.id === pk);
      setOrder(foundOrder || null);
      setLoading(false);
    }, 500);
  }, [pk]);

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-[80vh]">
        <div className="animate-pulse text-lg">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>
              The purchase order you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => navigate("/pharmacy/purchase-orders")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Purchase Orders
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Calculate total amount from items
  const formattedAmount = order.totalAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "Ksh",
    minimumFractionDigits: 2,
  });

  // Generate sample line items based on the drugs array
  const lineItems = order.drugs.map((drug, index) => ({
    id: `ITEM-${index + 1}`,
    name: drug,
    quantity: Math.floor(Math.random() * 10) + 1, // Random quantity between 1-10
    unitPrice: Math.floor(Math.random() * 1000) + 100, // Random price between 100-1100
  }));

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/pharmacy/purchase-orders")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Purchase Order Details</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setEditModalOpen(true)}
          >
            Edit Order
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" /> Send to Supplier
          </Button>
        </div>
      </div>

      {/* Order Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-40 flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Order ID:</span>
                </div>
                <div className="font-medium">{order.id}</div>
              </div>
              <div className="flex items-start">
                <div className="w-40 flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>LPO Number:</span>
                </div>
                <div className="font-medium">{order.lpoNo}</div>
              </div>
              <div className="flex items-start">
                <div className="w-40 flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Order Date:</span>
                </div>
                <div className="font-medium">
                  {new Date(order.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-40 flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Status:</span>
                </div>
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Approved"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-40 flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Total Amount:</span>
                </div>
                <div className="font-medium">{formattedAmount}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supplier Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-40 flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Supplier:</span>
                </div>
                <div className="font-medium">{order.supplier}</div>
              </div>
              <div className="flex items-start">
                <div className="w-40 flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Contact:</span>
                </div>
                <div className="font-medium">John Doe</div>
              </div>
              <div className="flex items-start">
                <div className="w-40 flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Email:</span>
                </div>
                <div className="font-medium">{`${order.supplier.toLowerCase().replace(" ", "")}@example.com`}</div>
              </div>
              <div className="flex items-start">
                <div className="w-40 flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Phone:</span>
                </div>
                <div className="font-medium">+1 (555) 123-4567</div>
              </div>
              <div className="flex items-start">
                <div className="w-40 flex items-center gap-2 text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Delivery:</span>
                </div>
                <div className="font-medium">
                  {order.status === "Completed" ? "Delivered" : "Pending"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
          <CardDescription>
            This order contains {order.totalItems} items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item) => {
                const itemTotal = item.quantity * item.unitPrice;
                return (
                  <TableRow className="even:bg-muted" key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                        <div className="py-2">{item.name}</div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {item.unitPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "Ksh",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {itemTotal.toLocaleString("en-US", {
                        style: "currency",
                        currency: "Ksh",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Subtotal
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formattedAmount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 border-l space-y-6">
            <div className="relative">
              <div className="absolute -left-[25px] rounded-full bg-primary w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="mb-1 text-sm font-semibold">
                Order Created
                <span className="text-muted-foreground font-normal ml-2">
                  {new Date(order.date).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Purchase order was created by Admin User
              </p>
            </div>

            {order.status === "Approved" || order.status === "Completed" ? (
              <div className="relative">
                <div className="absolute -left-[25px] rounded-full bg-primary w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="mb-1 text-sm font-semibold">
                  Order Approved
                  <span className="text-muted-foreground font-normal ml-2">
                    {new Date(
                      new Date(order.date).getTime() + 86400000
                    ).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Purchase order was approved by Finance Manager
                </p>
              </div>
            ) : null}

            {order.status === "Completed" ? (
              <div className="relative">
                <div className="absolute -left-[25px] rounded-full bg-primary w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="mb-1 text-sm font-semibold">
                  Order Delivered
                  <span className="text-muted-foreground font-normal ml-2">
                    {new Date(
                      new Date(order.date).getTime() + 86400000 * 5
                    ).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Items were received and verified by Pharmacy Manager
                </p>
              </div>
            ) : null}

            {order.status === "Cancelled" ? (
              <div className="relative">
                <div className="absolute -left-[25px] rounded-full bg-destructive w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="mb-1 text-sm font-semibold">
                  Order Cancelled
                  <span className="text-muted-foreground font-normal ml-2">
                    {new Date(
                      new Date(order.date).getTime() + 86400000
                    ).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Purchase order was cancelled by Admin User
                </p>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <PurchaseOrderModal open={editModalOpen} onOpenChange={setEditModalOpen} />
    </div>
  );
}

export default PurchaseOrder;
