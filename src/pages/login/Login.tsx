import { Helmet } from 'react-helmet'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { LockIcon, UserIcon } from "lucide-react"
import { Link,useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import useLogin from './hooks/useLogin'


type LoginFormData = {
  email: string
  password: string
}
const Login = () => {

  //? useNavigate
  const navigate = useNavigate()
  //? useForm 
  const { register, handleSubmit,reset } = useForm<LoginFormData>()

  //custom hook for handlLogin
  const {handleLogin} = useLogin()
  
  const onSubmit = async(data: LoginFormData) => {
    
    const response = await handleLogin(data) //? Handle login logic here

    if(response.error) {
      if (response.status === 401) {
        navigate("/404")
      }
      return  alert(response.message)
    }
    //TODO: NAVIGATE THE STACKHOLDER TO DASHBOARD 
    navigate('/')
    reset() //? Reset the form fields after submission
  }

  return (
    <>
      <Helmet>
        <title>Smart Roll | Login</title>
      </Helmet>

      

      <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-black">
        <div className="bg-background shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login to SmartRoll</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  
                  {...register("email", { required: true })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: true })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                   
                  
                />
                <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
      
    </>
  )
}

export default Login
