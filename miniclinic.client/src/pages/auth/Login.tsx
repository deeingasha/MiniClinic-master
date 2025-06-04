import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useState } from 'react'
import { HeartPulse, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '@/api/mutation/user.mutation'
import { authService } from '@/services/auth.service'

const formSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleNo: z.number().default(1)
})

type FormValues = z.infer<typeof formSchema>

function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()
  
  // Use the login mutation hook
  const loginMutation = useLoginMutation()
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      roleNo: 1 // Default role (adjust based on your system)
    }
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    
    try {
      // Call the API using the mutation
      const response = await loginMutation.mutateAsync({
        username: data.username,
        password: data.password,
        roleNo: data.roleNo
      })
      
      // Process the token in auth service
      const user = await authService.login(response)
      
      // Update the auth store
      setUser(user)
      
      toast.success("Login successful")
      navigate('/')
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error instanceof Error ? error.message : "Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex justify-center items-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <HeartPulse className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-primary text-center text-2xl font-bold">Welcome to Mini Clinic</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
                          {...field} 
                          disabled={isLoading}
                          className="pl-9"
                        />
                      </FormControl>
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
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
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          {...field} 
                          disabled={isLoading}
                          className="pl-9"
                        />
                      </FormControl>
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || loginMutation.isPending}
              >
                {isLoading || loginMutation.isPending ? "Logging in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            <p>Demo credentials:</p>
            <p className="font-medium">Username: doctor | Password: password123 | Role: 1</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login