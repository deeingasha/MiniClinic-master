import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, Search, EyeIcon } from "lucide-react";
import PurchaseOrderModal from "./AddPurchaseOrder";
import { ColumnDef } from "@tanstack/react-table";
import { OrderModel } from "@/types";
import { orders } from "@/data/data";
import { DataTable } from "@/components/data-table/data-table";
import { Link } from "react-router-dom";

// Sample data for purchase orders

const columns: ColumnDef<OrderModel>[] = [
  {
    accessorKey: "lpoNo",
    header: "LPO No",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => `Ksh.${row.original.totalAmount}`,
  },
  {
    accessorKey: "status",
    cell: ({ row }) => (
      <div
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          row.original.status === "Completed"
            ? "bg-green-100 text-green-800"
            : row.original.status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : row.original.status === "Approved"
            ? "bg-blue-100 text-blue-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.status}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/pharmacy/purchase-orders/${row.original.id}`}>
            <EyeIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];

function PurchaseOrder() {
  const [displayOrders, setDisplayOrders] = useState<OrderModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter orders based on search term
  useEffect(() => {
    const filteredOrders = orders.filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.supplier.toLowerCase().includes(searchLower) ||
        order.lpoNo.toLowerCase().includes(searchLower) ||
        order.drugs.some((drug) => drug.toLowerCase().includes(searchLower))
      );
    });
    setDisplayOrders(filteredOrders);
  }, [searchTerm]);

  useEffect(() => {
    setDisplayOrders(orders);
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Purchase Orders</CardTitle>
            <CardDescription>
              Manage and track all pharmacy purchase orders
            </CardDescription>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" /> New Purchase Order
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 opacity-50" />
              <Input
                placeholder="Search by supplier or drug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                onValueChange={(value) => setSortBy(value)}
                defaultValue={sortBy || ""}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="lpoNo">LPO Number</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="totalAmount">Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <DataTable columns={columns} data={displayOrders as OrderModel[]} />
          </div>
        </CardContent>
      </Card>

      {/* Purchase Order Modal */}
      <PurchaseOrderModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}

export default PurchaseOrder;
