import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomDatePicker } from "@/components/date-picker";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Save } from "lucide-react";
import { users } from "@/data/data";

// Sample data for lab tests
const sampleTests = [
  {
    id: "TEST-001",
    patientId: "PAT-001",
    patientName: "John Doe",
    doctorId: "USR-001",
    doctorName: "Dr. Sarah Johnson",
    testName: "Complete Blood Count",
    subTest: "Hemoglobin",
    requestDate: "2025-04-05",
    status: "Pending",
    unit: "g/dL",
    lowRange: "13.5",
    highRange: "17.5",
    result: "",
    price: 1500,
  },
  {
    id: "TEST-002",
    patientId: "PAT-002",
    patientName: "Jane Smith",
    doctorId: "USR-002",
    doctorName: "Dr. Michael Brown",
    testName: "Liver Function Test",
    subTest: "ALT",
    requestDate: "2025-04-06",
    status: "Pending",
    unit: "U/L",
    lowRange: "7",
    highRange: "55",
    result: "",
    price: 2000,
  },
  {
    id: "TEST-003",
    patientId: "PAT-003",
    patientName: "Robert Wilson",
    doctorId: "USR-001",
    doctorName: "Dr. Sarah Johnson",
    testName: "Urinalysis",
    subTest: "Protein",
    requestDate: "2025-04-07",
    status: "Completed",
    unit: "mg/dL",
    lowRange: "0",
    highRange: "8",
    result: "2",
    price: 1200,
  },
  {
    id: "TEST-004",
    patientId: "PAT-001",
    patientName: "John Doe",
    doctorId: "USR-003",
    doctorName: "Dr. Emily Davis",
    testName: "Blood Glucose",
    subTest: "Fasting",
    requestDate: "2025-04-07",
    status: "Pending",
    unit: "mg/dL",
    lowRange: "70",
    highRange: "100",
    result: "",
    price: 800,
  },
];

// Sample data for dropdowns
const testNames = [
  "Complete Blood Count",
  "Liver Function Test",
  "Kidney Function Test",
  "Lipid Profile",
  "Thyroid Function Test",
  "Blood Glucose",
  "Urinalysis",
  "Electrolytes",
];

const pathologists = [
  "Dr. James Wilson",
  "Dr. Lisa Thompson",
  "Dr. Robert Garcia",
  "Dr. Emily Chen",
];


function Laboratory() {
  const [tests, setTests] = useState(sampleTests);
  const [testDate, setTestDate] = useState<Date>(new Date());
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedPathologist, setSelectedPathologist] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  // Handle saving test results
  const handleSaveResult = (testId: string, index: number) => {
    const result = testResults[testId] || "";
    if (!result) return;

    // Update the test with the result
    const updatedTests = [...tests];
    updatedTests[index] = {
      ...updatedTests[index],
      result,
      status: "Completed",
    };

    setTests(updatedTests);
    setEditingRow(null);
  };

  // Handle input change for test results
  const handleResultChange = (testId: string, value: string) => {
    setTestResults({
      ...testResults,
      [testId]: value,
    });
  };

  // Check if result is out of range
  const isOutOfRange = (test: any) => {
    if (!test.result) return false;
    const result = parseFloat(test.result);
    const low = parseFloat(test.lowRange);
    const high = parseFloat(test.highRange);
    return result < low || result > high;
  };

  // Handle sending alert for abnormal results
  const handleSendAlert = () => {
    const abnormalTests = tests.filter(isOutOfRange);
    if (abnormalTests.length > 0) {
      alert(`Alert sent for ${abnormalTests.length} abnormal test results`);
    } else {
      alert("No abnormal test results to send alerts for");
    }
  };

  // Handle saving all results
  const handleSaveAll = () => {
    // In a real app, this would send all results to the server
    alert("All test results saved successfully");
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Laboratory Tests</CardTitle>
          <CardDescription>
            View requested tests and input results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Top Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="test-date">Test Date</Label>
              <CustomDatePicker
                value={testDate}
                onChange={(value) => setTestDate(value as Date)}
                placeholder="Select date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pathologist">Test entered by</Label>
              <Select
                value={selectedPathologist}
                onValueChange={setSelectedPathologist}
              >
                <SelectTrigger id="pathologist" className="w-full">
                  <SelectValue placeholder="Select pathologist" />
                </SelectTrigger>
                <SelectContent>
                  {pathologists.map((pathologist) => (
                    <SelectItem key={pathologist} value={pathologist}>
                      {pathologist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Report to be sent to</Label>
              <Select
                value={selectedRecipient}
                onValueChange={setSelectedRecipient}
              >
                <SelectTrigger id="recipient" className="w-full">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) =>{
                    if(user.role !== "doctor" && user.role !== "nurse"){
                        return null;
                    }
                     return (
                    <SelectItem key={user.id} value={user.id}>
                      Dr.{user.firstName} {user.lastName}
                    </SelectItem>
                  )})}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-start mb-6">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleSendAlert}
            >
              <AlertCircle className="h-4 w-4" />
              Send Alert
            </Button>
          </div>

          {/* Test Selection */}
          <div className="mb-6">
            <Label htmlFor="test-name">Test Name</Label>
            <Select
              value={selectedTest}
              onValueChange={setSelectedTest}
            >
              <SelectTrigger id="test-name" className="w-full mt-2">
                <SelectValue placeholder="Select test" />
              </SelectTrigger>
              <SelectContent>
                {testNames.map((test) => (
                  <SelectItem key={test} value={test}>
                    {test}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-6" />

          {/* Tests Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No.</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Sub Test</TableHead>
                  <TableHead>Test Result</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Low</TableHead>
                  <TableHead>High</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price (Ksh)</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests
                  .filter(
                    (test) =>
                      !selectedTest || test.testName === selectedTest
                  )
                  .map((test, index) => (
                    <TableRow
                      key={test.id}
                      className={isOutOfRange(test) ? "bg-red-50" : ""}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.subTest}</TableCell>
                      <TableCell>
                        {editingRow === index ? (
                          <Input
                            value={testResults[test.id] || test.result || ""}
                            onChange={(e) =>
                              handleResultChange(test.id, e.target.value)
                            }
                            className="w-24"
                          />
                        ) : (
                          <span
                            className={`${isOutOfRange(test) ? "text-red-600 font-bold" : ""}`}
                          >
                            {test.result || "--"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{test.unit}</TableCell>
                      <TableCell>{test.lowRange}</TableCell>
                      <TableCell>{test.highRange}</TableCell>
                      <TableCell>
                        {new Date(test.requestDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{test.price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {test.status === "Pending" ? (
                          editingRow === index ? (
                            <Button
                              size="sm"
                              onClick={() => handleSaveResult(test.id, index)}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRow(index)}
                            >
                              Enter Result
                            </Button>
                          )
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRow(index)}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
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

export default Laboratory;
