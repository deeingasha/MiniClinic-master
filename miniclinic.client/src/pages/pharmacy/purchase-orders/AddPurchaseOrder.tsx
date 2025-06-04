import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { PlusIcon, SendIcon, TrashIcon, XIcon } from "lucide-react";
  import { z } from "zod";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useState } from "react";
  import { CustomDatePicker } from "@/components/date-picker";
import { Separator } from "@/components/ui/separator";

  interface PurchaseOrderProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }

  const formSchema = z.object({
    supplier: z.string({ required_error: "Please select a supplier" }),
    lpoNo: z.string({ required_error: "Please select an LPO number" }),
    lpoDate: z.date({ required_error: "Please select a date" }),
    remarks: z.string().optional(),
    supplierEmail: z.string().email("Invalid email address").optional(),
    password: z.string().optional(),
    items: z
      .array(
        z.object({
          drugName: z.string(),
          unitPrice: z.number().min(0, "Price must be a positive number"),
          quantity: z.number().min(1, "Quantity must be at least 1"),
        })
      )
      .min(1, "At least one item is required"),
  });

  type FormValues = z.infer<typeof formSchema>;

  function PurchaseOrder({ open, onOpenChange }: PurchaseOrderProps) {
    const [items, setItems] = useState<
      Array<{ id: number; drugName: string; unitPrice: number; quantity: number }>
    >([{ id: 1, drugName: "", unitPrice: 0, quantity: 0 }]);

    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        supplier: "",
        lpoNo: "",
        lpoDate: new Date(),
        remarks: "",
        supplierEmail: "",
        password: "",
        items: [{ drugName: "", unitPrice: 0, quantity: 0 }],
      },
    });

    function onSubmit(data: FormValues) {
      console.log("Form submitted:", data);
      // Handle form submission logic here
    }

    const addItem = () => {
      const newId =
        items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
      setItems([
        ...items,
        { id: newId, drugName: "", unitPrice: 0, quantity: 0 },
      ]);
    };

    const removeItem = (id: number) => {
      if (items.length > 1) {
        setItems(items.filter((item) => item.id !== id));
      }
    };

    const updateItem = (id: number, field: string, value: string | number) => {
      // If the field being updated is drugName, also update the unitPrice
      if (field === "drugName") {
        const drugName = String(value); // Ensure drugName is always a string
        const drugPrice = getDrugPrice(drugName);
        setItems(
          items.map((item) =>
            item.id === id
              ? { ...item, drugName, unitPrice: drugPrice }
              : item
          )
        );
      } else {
        setItems(
          items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
      }
    };

    // Function to get drug price based on drug name
    const getDrugPrice = (drugName: string): number => {
      // This would ideally come from your database
      // For now, we'll use a simple mapping
      const drugPrices: Record<string, number> = {
        "Paracetamol": 150,
        "Amoxicillin": 350,
        "Ibuprofen": 200,
        "Metformin": 450,
        "Atorvastatin": 750
      };

      return drugPrices[drugName] || 0;
    };

    const calculateTotal = (unitPrice: number, quantity: number) => {
      return (unitPrice * quantity).toFixed(2);
    };

    const suppliers = ["Supplier A", "Supplier B", "Supplier C"];
    const lpoNumbers = ["LPO-001", "LPO-002", "LPO-003"];
    const drugOptions = [
      "Paracetamol",
      "Amoxicillin",
      "Ibuprofen",
      "Metformin",
      "Atorvastatin",
    ];

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="w-full min-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Purchase Order
            </AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 overflow-y-auto max-h-[90vh]"
            >
              {/* Top section with 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {/* Left column */}
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier} value={supplier}>
                                {supplier}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  {/* Right column */}
                  <FormField
                    control={form.control}
                    name="lpoNo"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>LPO No.</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select LPO" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {lpoNumbers.map((lpo) => (
                              <SelectItem key={lpo} value={lpo}>
                                {lpo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lpoDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>LPO Date</FormLabel>
                        <FormControl>
                          {/* Replace MUI DatePicker with our custom one */}
                          <CustomDatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="py-2">
                <Separator />
              </div>

              {/* Drug selection dropdown */}
              {/* <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <FormLabel htmlFor="drug-name">Drug name</FormLabel>
                  <Select>
                    <SelectTrigger className="mt-2 w-full" id="drug-name">
                      <SelectValue placeholder="Select drug" />
                    </SelectTrigger>
                    <SelectContent>
                      {drugOptions.map((drug) => (
                        <SelectItem key={drug} value={drug}>
                          {drug}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button">Load Drugs</Button>
              </div> */}

              {/* Items table */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Item</TableHead>
                      <TableHead>Drug Name</TableHead>
                      <TableHead className="w-24">Unit price</TableHead>
                      <TableHead className="w-20">Qty</TableHead>
                      <TableHead className="w-24">Total</TableHead>
                      <TableHead className="w-24">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Select
                            value={item.drugName}
                            onValueChange={(value) =>
                              updateItem(item.id, "drugName", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select drug" />
                            </SelectTrigger>
                            <SelectContent>
                              {drugOptions.map((drug) => (
                                <SelectItem key={drug} value={drug}>
                                  {drug}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.unitPrice || ""}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "unitPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity || ""}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                        Ksh.{calculateTotal(item.unitPrice, item.quantity)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length <= 1}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full border-primary text-primary hover:text-primary hover:bg-primary/10"
              >
                <PlusIcon className="h-4 w-4 mr-2" /> Add Item
              </Button>


              <div className="py-4">
                <Separator />
              </div>

              {/* Email section */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supplierEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <AlertDialogFooter className="gap-4">
                <AlertDialogCancel>
                  <XIcon className="h-4 w-4 mr-2" />
                  Close
                </AlertDialogCancel>
                <Button type="button">
                  <SendIcon className="h-4 w-4 mr-2" /> Send LPO to Supplier
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  export default PurchaseOrder;
