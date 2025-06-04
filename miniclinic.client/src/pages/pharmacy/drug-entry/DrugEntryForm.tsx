import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusIcon, XIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface DrugEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  drugName: z.string().min(2, { message: "Drug name is required" }),
  drugCode: z.string().min(2, { message: "Drug code is required" }),
  drugType: z.string().min(1, { message: "Drug type is required" }),
  manufacturer: z.string().min(1, { message: "Manufacturer is required" }),
  reorderLevel: z.coerce.number().min(0, { message: "Reorder level must be a positive number" }),
  totalStock: z.coerce.number().min(0, { message: "Total stock must be a positive number" }),
  unitPrice: z.coerce.number().min(0, { message: "Unit price must be a positive number" }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function DrugEntryForm({ open, onOpenChange }: DrugEntryFormProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
      drugCode: "",
      drugType: "",
      manufacturer: "",
      reorderLevel: 10,
      totalStock: 0,
      unitPrice: 0,
      description: "",
    },
  });

  function onSubmit(data: FormValues) {
    console.log("Form submitted:", data);
    // Handle form submission logic here
    onOpenChange(false);
  }

  // Sample data for dropdowns
  const drugTypes = [
    "Analgesic",
    "Antibiotic",
    "Antiviral",
    "Antihistamine",
    "Antidepressant",
    "Antihypertensive",
    "Bronchodilator",
    "Statin",
    "ACE Inhibitor",
  ];

  const manufacturers = [
    "Pfizer",
    "Merck",
    "Johnson & Johnson",
    "GlaxoSmithKline",
    "Novartis",
    "Roche",
    "Sanofi",
    "AbbVie",
    "Bayer",
  ];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="min-w-2xl overflow-y-auto max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Drug Entry</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Search Section */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="drugType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drug Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select drug type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {drugTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <div className="col-span-1 flex items-end">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Search drugs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="secondary" size="icon">
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div> */}
            </div>

            {/* Main Form */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Left Column */}
                <FormField
                  control={form.control}
                  name="drugCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drug Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., DRUG-001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="drugName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drug Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Paracetamol" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select manufacturer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {manufacturers.map((manufacturer) => (
                            <SelectItem key={manufacturer} value={manufacturer}>
                              {manufacturer}
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
                  name="reorderLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder Level</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormDescription>
                        Minimum stock level before reordering
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                {/* Right Column */}
                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price (Ksh)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total QTY in stock</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter drug description, usage instructions, etc."
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <AlertDialogFooter className="gap-2 pt-2">
              <AlertDialogCancel>
                <XIcon className="h-4 w-4 mr-2" />Close
              </AlertDialogCancel>
              <Button type="submit">
                <PlusIcon className="h-4 w-4 mr-2" />Add Drug
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DrugEntryForm;
