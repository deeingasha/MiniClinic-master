import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomDatePicker } from "@/components/date-picker";
import { DataTable } from "@/components/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Save } from "lucide-react";

// Sample suppliers data
const suppliers = [
  "ABC Pharmaceuticals",
  "MedLife Supplies",
  "HealthPlus Distributors",
  "PharmaCare Ltd",
  "Global Meds Inc",
];

// Sample orders data
const orders = [
  { id: "ORD-001", supplier: "ABC Pharmaceuticals", date: "2025-03-15", status: "Pending" },
  { id: "ORD-002", supplier: "MedLife Supplies", date: "2025-03-20", status: "Approved" },
  { id: "ORD-003", supplier: "HealthPlus Distributors", date: "2025-03-25", status: "Delivered" },
];

// Sample drugs data for the table
type DrugReceiptItem = {
  id: string;
  itemNo: number;
  drugName: string;
  invoiceNo: string;
  invoiceDate: string;
  expiryDate: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number;
  discount: number;
  bonus: number;
  totalPrice: number;
  receivedDate: string;
  manufacturer: string;
  mfgDate: string;
  batchNo: string;
  invoiceStatus: string;
};

const sampleDrugs: DrugReceiptItem[] = [
  {
    id: "1",
    itemNo: 1,
    drugName: "Paracetamol 500mg",
    invoiceNo: "INV-001",
    invoiceDate: "2025-03-15",
    expiryDate: "2027-03-15",
    orderedQty: 1000,
    receivedQty: 1000,
    unitPrice: 10,
    discount: 5,
    bonus: 0,
    totalPrice: 9500,
    receivedDate: "2025-04-01",
    manufacturer: "ABC Pharma",
    mfgDate: "2024-03-15",
    batchNo: "BT-001",
    invoiceStatus: "Received",
  },
  {
    id: "2",
    itemNo: 2,
    drugName: "Amoxicillin 250mg",
    invoiceNo: "INV-001",
    invoiceDate: "2025-03-15",
    expiryDate: "2026-09-15",
    orderedQty: 500,
    receivedQty: 500,
    unitPrice: 15,
    discount: 3,
    bonus: 25,
    totalPrice: 7275,
    receivedDate: "2025-04-01",
    manufacturer: "MedLife",
    mfgDate: "2024-02-10",
    batchNo: "BT-045",
    invoiceStatus: "Received",
  },
  {
    id: "3",
    itemNo: 3,
    drugName: "Ciprofloxacin 500mg",
    invoiceNo: "INV-002",
    invoiceDate: "2025-03-16",
    expiryDate: "2027-01-20",
    orderedQty: 300,
    receivedQty: 300,
    unitPrice: 25,
    discount: 2,
    bonus: 0,
    totalPrice: 7350,
    receivedDate: "2025-04-02",
    manufacturer: "HealthPlus",
    mfgDate: "2024-01-15",
    batchNo: "BT-112",
    invoiceStatus: "Received",
  },
];

// Define columns for the data table
const columns: ColumnDef<DrugReceiptItem>[] = [
  {
    accessorKey: "itemNo",
    header: "Item No",
    cell: ({ row }) => <div className="text-center">{row.original.itemNo}</div>,
  },
  {
    accessorKey: "drugName",
    header: "Drug Name",
    cell: ({ row }) => (
      <Input defaultValue={row.original.drugName} className="h-8" />
    ),
  },
  {
    accessorKey: "invoiceNo",
    header: "Invoice No",
    cell: ({ row }) => (
      <Input defaultValue={row.original.invoiceNo} className="h-8 w-24" />
    ),
  },
  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",
    cell: ({ row }) => (
      <Input
        type="date"
        defaultValue={row.original.invoiceDate}
        className="h-8 w-32"
      />
    ),
  },
  {
    accessorKey: "expiryDate",
    header: "Exp. Date",
    cell: ({ row }) => (
      <Input
        type="date"
        defaultValue={row.original.expiryDate}
        className="h-8 w-32"
      />
    ),
  },
  {
    accessorKey: "orderedQty",
    header: "O Qty",
    cell: ({ row }) => (
      <Input
        type="number"
        defaultValue={row.original.orderedQty.toString()}
        className="h-8 w-16"
      />
    ),
  },
  {
    accessorKey: "receivedQty",
    header: "R Qty",
    cell: ({ row }) => (
      <Input
        type="number"
        defaultValue={row.original.receivedQty.toString()}
        className="h-8 w-16"
      />
    ),
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => (
      <Input
        type="number"
        defaultValue={row.original.unitPrice.toString()}
        className="h-8 w-20"
      />
    ),
  },
  {
    accessorKey: "discount",
    header: "Disc (%)",
    cell: ({ row }) => (
      <Input
        type="number"
        defaultValue={row.original.discount.toString()}
        className="h-8 w-16"
      />
    ),
  },
  {
    accessorKey: "bonus",
    header: "Bonus",
    cell: ({ row }) => (
      <Input
        type="number"
        defaultValue={row.original.bonus.toString()}
        className="h-8 w-16"
      />
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.totalPrice.toLocaleString()} Ksh
      </div>
    ),
  },
  {
    accessorKey: "receivedDate",
    header: "Received Date",
    cell: ({ row }) => (
      <Input
        type="date"
        defaultValue={row.original.receivedDate}
        className="h-8 w-32"
      />
    ),
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
    cell: ({ row }) => (
      <Select defaultValue={row.original.manufacturer}>
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ABC Pharma">ABC Pharma</SelectItem>
          <SelectItem value="MedLife">MedLife</SelectItem>
          <SelectItem value="HealthPlus">HealthPlus</SelectItem>
          <SelectItem value="PharmaCare">PharmaCare</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    accessorKey: "mfgDate",
    header: "Mfg Date",
    cell: ({ row }) => (
      <Input
        type="date"
        defaultValue={row.original.mfgDate}
        className="h-8 w-32"
      />
    ),
  },
  {
    accessorKey: "batchNo",
    header: "Batch No",
    cell: ({ row }) => (
      <Input
        defaultValue={row.original.batchNo}
        className="h-8 w-20"
      />
    ),
  },
  {
    accessorKey: "invoiceStatus",
    header: "Invoice Status",
    cell: ({ row }) => (
      <Select defaultValue={row.original.invoiceStatus}>
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Received">Received</SelectItem>
          <SelectItem value="Partial">Partial</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: () => (
      <Select defaultValue="save">
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="save">Save</SelectItem>
          <SelectItem value="cancel">Cancel</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
];

function ReceiveDrugs() {
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [orderDate, setOrderDate] = useState<Date | undefined>(new Date());
  const [lpoStatus, setLpoStatus] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [remarks, setRemarks] = useState("");
  const [drugs, setDrugs] = useState<DrugReceiptItem[]>([]);

  // Handle saving all entries
  const handleSaveAll = () => {
    alert("All drug receipts saved successfully!");
  };

  useEffect(() => {
    setDrugs(sampleDrugs);
  }, []);

  return (
    <div className="container grid grid-cols-1 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Receive Drugs</CardTitle>
          <CardDescription>
            Record received drugs from suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Top form section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select
                value={selectedSupplier}
                onValueChange={setSelectedSupplier}
              >
                <SelectTrigger id="supplier" className="w-full">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="order-no">Order No</Label>
                <Select
                  value={selectedOrder}
                  onValueChange={setSelectedOrder}
                >
                  <SelectTrigger id="order-no" className="w-full">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            <div className="space-y-2">
              <Label htmlFor="lpo-status">LPO Status</Label>
              <Input
                id="lpo-status"
                value={lpoStatus}
                onChange={(e) => setLpoStatus(e.target.value)}
                className="w-full"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-date">Order Date</Label>
              <CustomDatePicker
                value={orderDate}
                onChange={setOrderDate}
                // placeholder="Select date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="approved-by">Approved by</Label>
              <Input
                id="approved-by"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Checkbox id="verified" />
            <Label htmlFor="verified" className="font-medium text-sm">
              I verify that all drugs have been received in good condition and match the order details
            </Label>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={drugs}
              showGlobalFilter={false}
              showPagination={false}
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSaveAll}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReceiveDrugs;
