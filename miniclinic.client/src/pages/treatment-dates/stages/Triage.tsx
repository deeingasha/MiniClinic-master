import { useEffect } from "react";
import { PatientModel } from "@/types";
import { format } from "date-fns";
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
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity } from "lucide-react";
import { CustomDatePicker } from "@/components/date-picker";

interface TriageProps {
  patient: PatientModel;
}

// Sample checked dates history - replace with actual API call in production
const checkedDatesHistory = [
  { id: 1, date: "2025-03-15" },
  { id: 2, date: "2025-02-20" },
  { id: 3, date: "2025-01-10" },
];

const formSchema = z.object({
  date: z.date(),
  checkedDate: z.string().optional(),
  ageYears: z.string().optional(),
  ageMonths: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  bmi: z.string().optional(),
  bloodPressure: z.string().optional(),
  saturation: z.string().optional(),
  temperature: z.string().optional(),
  pulseRate: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function Triage({ patient }: TriageProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      checkedDate: "",
      ageYears: "",
      ageMonths: "",
      height: "",
      weight: "",
      bmi: "",
      bloodPressure: "",
      saturation: "",
      temperature: "",
      pulseRate: "",
    },
  });

  const { watch, setValue } = form;
  const height = watch("height");
  const weight = watch("weight");

  // Calculate age from patient's date of birth
  useEffect(() => {
    if (patient && patient.dateOfBirth) {
      const birthDate = new Date(patient.dateOfBirth);
      const today = new Date();

      // Calculate years
      let ageYears = today.getFullYear() - birthDate.getFullYear();

      // Calculate months
      let ageMonths = today.getMonth() - birthDate.getMonth();

      // Adjust years and months if needed
      if (
        ageMonths < 0 ||
        (ageMonths === 0 && today.getDate() < birthDate.getDate())
      ) {
        ageYears--;
        ageMonths = ageMonths + 12;
      }

      // If today's date is less than birth date's day, adjust months
      if (today.getDate() < birthDate.getDate()) {
        ageMonths--;
        if (ageMonths < 0) {
          ageMonths = 11;
        }
      }

      setValue("ageYears", ageYears.toString());
      setValue("ageMonths", ageMonths.toString());
    }
  }, [patient, setValue]);

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);

      if (heightInMeters > 0 && weightInKg > 0) {
        const calculatedBMI = (
          weightInKg /
          (heightInMeters * heightInMeters)
        ).toFixed(1);
        setValue("bmi", calculatedBMI);
      }
    }
  }, [height, weight, setValue]);

  const onSubmit = (data: FormData) => {
    console.log("Saving triage data:", data);
    alert("Triage data saved!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <div className="bg-white rounded-sm">
          <div className="flex items-center p-3 pb-2 border-b">
            <Activity className="mr-2 h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium">Patient Triage Information</h3>
          </div>

          <div className="p-3 pt-2">
            {/* Main grid layout - 4 columns */}
            <div className="grid grid-cols-4 gap-6 mb-4">
              {/* Date */}
              <div>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Date
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

              {/* Checked Dates */}
              <div>
                <FormField
                  control={form.control}
                  name="checkedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Checked Dates
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);

                          // In a real app, you would fetch the triage data for this date from your API
                          // if (value) {
                          //   console.log(`Fetching triage data for date: ${value}`);
                          //   // For demo purposes, just reset the form
                          //   setValue('ageYears', '');
                          //   setValue('ageMonths', '');
                          //   setValue('height', '');
                          //   setValue('weight', '');
                          //   setValue('bmi', '');
                          //   setValue('bloodPressure', '');
                          //   setValue('saturation', '');
                          //   setValue('temperature', '');
                          //   setValue('pulseRate', '');
                          // }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select date" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {checkedDatesHistory.map((item) => (
                            <SelectItem key={item.id} value={item.date}>
                              {format(new Date(item.date), "MMMM dd, yyyy")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Age in Years */}
              <div>
                <FormField
                  control={form.control}
                  name="ageYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Age (Years)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Years"
                          {...field}
                          readOnly
                          style={{ backgroundColor: "#f5f5f5" }}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Age in Months */}
              <div>
                <FormField
                  control={form.control}
                  name="ageMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Age (Months)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Months"
                          {...field}
                          readOnly
                          style={{ backgroundColor: "#f5f5f5" }}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Height (cm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Height"
                          type="number"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Weight */}
              <div>
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Weight (Kg)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Weight"
                          type="number"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* BMI */}
              <div>
                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        BMI (Kg/m²)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="BMI"
                          disabled
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Empty cell to maintain grid layout */}
              <div></div>

              {/* Blood Pressure */}
              <div>
                <FormField
                  control={form.control}
                  name="bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        BP (mmHg)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="120/80"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Oxygen Saturation */}
              <div>
                <FormField
                  control={form.control}
                  name="saturation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        O₂ Saturation (%)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Saturation"
                          type="number"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Temperature */}
              <div>
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Temperature (°C)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Temperature"
                          type="number"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Pulse Rate */}
              <div>
                <FormField
                  control={form.control}
                  name="pulseRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Pulse Rate (B/m)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pulse Rate"
                          type="number"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default Triage;
