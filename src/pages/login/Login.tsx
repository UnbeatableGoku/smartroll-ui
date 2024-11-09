import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LockIcon, UserIcon } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import NewPassword from '@components/NewPassword/NewPassword'
import ButtonLoader from '@components/common/form/buttonLoader/buttonLoader'

import useLogin from './hooks/useLogin'

type LoginFormData = {
  email: string
  password: string
}
const Login = () => {
  //? useNavigate
  const navigate = useNavigate()
  //? useForm
  const { register, handleSubmit, reset } = useForm<LoginFormData>()

  const [studentSlug, setStudentSlug] = useState<string>('')
  const [isTempPassword, setIsTempPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  //custom hook for handlLogin
  const { handleLogin, redirectLogin } = useLogin()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    const response = await handleLogin(data) //? Handle login logic here
    try {
      if (response.error && response?.student_slug) {
        setStudentSlug(response?.student_slug)
        setIsTempPassword(true)
        toast.warning('Temporary password. Please set a new password.')
      } else {
        if (response.error && response?.status === 401) {
          toast.error(`${response?.message}. Please try again.`)
        }
      }

      if (response.profile?.profile.role === 'admin') {
        navigate('/')
      } else if (response.profile?.profile.role === 'teacher') {
        navigate('/teacher-dashboard')
      } else if (response.profile?.profile.role === 'student') {
        navigate('/student-dashboard')
      }
    } catch (error) {
      toast.error('An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false) // Hide spinner when the request is completed (either success or failure)

      reset() //? Reset the form fields after submission
    }
  }

  useEffect(() => {
    redirectLogin()
  }, [])

  return (
    <>
      <Helmet>
        <title>Smart Roll | Login</title>
      </Helmet>
      {isTempPassword ? ( //? Render NewPassword component if isTempPassword is true
        <NewPassword student_slug={studentSlug} />
      ) : (
        <div className="flex min-h-screen flex-col">
          <main className="flex flex-grow items-center justify-center bg-black">
            <div className="w-full max-w-md rounded-lg bg-background p-8 shadow-lg">
              <h2 className="mb-6 text-center text-2xl font-bold">
                Login to SmartRoll
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register('email', { required: true })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...register('password', { required: true })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <ButtonLoader title="Logging in..." /> : 'Login'}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </main>
        </div>
      )}
    </>
  )
}

export default Login
