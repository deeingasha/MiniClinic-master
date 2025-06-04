import { PatientModel } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Save, Calendar as CalendarIcon } from "lucide-react";
import { CustomDatePicker } from "@/components/date-picker";

interface TreatmentDateProps {
  patient: PatientModel;
}

// Sample status options
const statusOptions = [
  { id: 1, name: "Open" },
  { id: 2, name: "close" },
];

// Sample payment types
const paymentTypes = [
  { id: 1, name: "Cash" },
  { id: 2, name: "Insurance" },
  { id: 4, name: "Direct" },
];

// Sample clients
const clients = [
  { id: 1, name: "Self" },
  { id: 2, name: "John Doe" },
  { id: 3, name: "Jane Smith" },
];

// Sample schemes
const schemes = [
  { id: 1, name: "NHIF" },
  { id: 2, name: "Jubilee" },
  { id: 3, name: "Corporate Scheme" },
];

// Sample doctors
const doctors = [
  { id: 1, name: "Dr. Michael Johnson" },
  { id: 2, name: "Dr. Sarah Williams" },
  { id: 3, name: "Dr. David Chen" },
  { id: 4, name: "Dr. Emily Taylor" },
];

const formSchema = z.object({
  treatmentDate: z.date(),
  patientStatus: z.string(),
  paymentType: z.string(),
  clientName: z.string(),
  scheme: z.string().optional(),
  insurer: z.string().optional(),
  appointmentDate: z.date().optional(),
  remarks: z.string().optional(),
  serviceType: z.enum(["Consultation", "Pharmacy", "Service"]),
  assignedDoctor: z.string().optional(),
  items: z
    .array(
      z.object({
        item: z.string(),
        price: z.number(),
        quantity: z.number(),
        id: z.number(),
      })
    )
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

function TreatmentDate({ patient }: TreatmentDateProps) {
  console.log("Patient data:", patient);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      treatmentDate: new Date(),
      patientStatus: statusOptions[0].name,
      paymentType: paymentTypes[0].name,
      clientName: clients[0].name,
      scheme: "",
      insurer: "",
      appointmentDate: new Date(),
      remarks: "",
      serviceType: "Consultation",
      assignedDoctor: "",
      items: [],
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Saving treatment data:", data);
    alert("Treatment data saved!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-sm">
            <div className="flex items-center p-3 pb-2 border-b">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-medium">Treatment Details</h3>
            </div>

            <div className="p-3 pt-2">
              {/* Main grid layout - 4 columns */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                {/* Treatment Date */}
                <div>
                  <FormField
                    control={form.control}
                    name="treatmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">
                          Treatment Date
                        </FormLabel>
                        <FormControl>
                          <CustomDatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select date"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Status */}
                <div>
                  <FormField
                    control={form.control}
                    name="patientStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.id} value={status.name}>
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Assigned Doctor */}
                <div>
                  <FormField
                    control={form.control}
                    name="assignedDoctor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">
                          Assign Doctor
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue placeholder="Assign doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {doctors.map((doctor) => (
                              <SelectItem key={doctor.id} value={doctor.name}>
                                {doctor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Save Button */}
                <div className="flex items-end justify-end">
                  <Button type="submit" className="h-10">
                    <Save className="h-4 w-4 mr-2" />
                    Save Treatment
                  </Button>
                </div>

                {/* Payment section header - spans all 4 columns */}
                <div className="col-span-4 bg-gray-50 p-2 rounded-md">
                  <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment Information
                  </h4>
                </div>

                {/* Payment Type */}
                <div>
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">
                          Payment Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentTypes.map((type) => (
                              <SelectItem key={type.id} value={type.name}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Scheme */}
                <div>
                  <FormField
                    control={form.control}
                    name="scheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">
                          Scheme
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue placeholder="Select scheme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {schemes.map((scheme) => (
                              <SelectItem key={scheme.id} value={scheme.name}>
                                {scheme.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Insurer */}
                <div>
                  <FormField
                    control={form.control}
                    name="insurer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">
                          Insurer
                        </FormLabel>
                        <FormControl>
                          <Input className="h-10" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Empty cell to maintain grid alignment */}
                <div></div>

                {/* Appointment section header - spans all 4 columns */}
                <div className="col-span-4 bg-gray-50 p-2 rounded-md">
                  <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Appointment
                  </h4>
                </div>

                {/* Next Appointment with Book button */}
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">
                          Next Appointment
                        </FormLabel>
                        <div className="flex gap-2">
                          <FormControl className="flex-1">
                            <CustomDatePicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select date"
                            />
                          </FormControl>
                          <Button size="sm" className="h-10 whitespace-nowrap">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Book
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Remarks - spans 2 columns */}
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">
                          Remarks
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="h-10 min-h-10 resize-none"
                            placeholder="Enter treatment remarks here"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default TreatmentDate;
