import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import NewPassword from '@components/NewPassword/NewPassword'
import ButtonLoader from '@components/common/form/buttonLoader/ButtonLoader'

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

  const [showPassword, setShowPassword] = useState(false)
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register('password', { required: true })}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        </main>
      </div>
      )}
    </>
  )
}



export default Login
