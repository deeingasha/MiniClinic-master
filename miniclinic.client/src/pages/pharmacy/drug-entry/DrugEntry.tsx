import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DrugModel } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Filter, PillIcon, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DrugEntryForm from "./DrugEntryForm";
import PurchaseOrder from "../purchase-orders/AddPurchaseOrder";
import LoadingScreen from "@/components/loading-screen";

const columns: ColumnDef<DrugModel>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Drug Name",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      if (row.original.stock > 0) {
        return (
          <div className="flex items-center gap-2">
            <span className="text-green-500">{row.getValue("stock")}</span>
            <span className="text-green-500">In Stock</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2">
            <span className="text-red-500">{row.getValue("stock")}</span>
            <span className="text-red-500">Out of Stock</span>
          </div>
        );
      }
    },
  },
];

function DrugEntry() {
  const [loading, setLoading] = useState(true);
  const [drugs, setDrugs] = useState<DrugModel[]>([]);
  const [filteredDrugs, setFilteredDrugs] = useState<DrugModel[]>([]);
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    populateDrugData();
  }, []);

  const uniqueManufacturers = [
    ...new Set(drugs.map((drug) => drug.manufacturer)),
  ];
  const uniqueTypes = [...new Set(drugs.map((drug) => drug.type))];

  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...drugs];

    // Apply manufacturer filter
    if (manufacturerFilter) {
      result = result.filter(
        (drug) => drug.manufacturer === manufacturerFilter
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((drug) => drug.type === typeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (drug) =>
          drug.name.toLowerCase().includes(query) ||
          drug.code.toLowerCase().includes(query) ||
          drug.manufacturer.toLowerCase().includes(query) ||
          drug.type.toLowerCase().includes(query)
      );
    }

    setFilteredDrugs(result);
  }, [manufacturerFilter, typeFilter, searchQuery]);

  // Reset all filters
  const handleResetFilters = () => {
    setManufacturerFilter("");
    setTypeFilter("");
    setSearchQuery("");
  };

  const [purchaseOrderOpen, setPurchaseOrderOpen] = useState(false);
  const [drugEntryOpen, setDrugEntryOpen] = useState(false);

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="space-y-4 grid grid-cols-1">
      <div className="bg-white rounded-sm">
        <div className="flex items-center justify-between p-3 pb-2 border-b">
          <div className="flex items-center">
            <PillIcon className="mr-2 h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium">Drugs</h3>
          </div>

          <div className="flex justify-end items-center gap-4">
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setPurchaseOrderOpen(true)}
            >
              <Plus className="mr-1 h-3 w-3" />
              Purchase Order
            </Button>

            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setDrugEntryOpen(true)}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Drug
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 border-b">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Filter className="mr-1 h-3 w-3" />
            Filters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Filter */}
            <div>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search drugs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Manufacturer Filter */}
            <div>
              <Select
                value={manufacturerFilter}
                onValueChange={(value) => {
                  if (value === "all") {
                    setManufacturerFilter("");
                  } else {
                    setManufacturerFilter(value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Manufacturers</SelectItem>
                  {uniqueManufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer} value={manufacturer}>
                      {manufacturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  if (value === "all") {
                    setTypeFilter("");
                  } else {
                    setTypeFilter(value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Drugs Table */}
        <div className="p-2">
          <DataTable
            columns={columns}
            data={filteredDrugs}
            showGlobalFilter={false}
          />
        </div>
      </div>

      <DrugEntryForm open={drugEntryOpen} onOpenChange={setDrugEntryOpen} />
      <PurchaseOrder
        open={purchaseOrderOpen}
        onOpenChange={setPurchaseOrderOpen}
      />
    </div>
  );

  async function populateDrugData() {
    try {
      const response = await fetch("/api/drugs");
      if (response.ok) {
        const data = await response.json();
        setDrugs(data);
        setFilteredDrugs(data);
      }
    } catch (error) {
      console.error("Error fetching drug data:", error);
    } finally {
      setLoading(false);
    }
  }
}

export default DrugEntry;
