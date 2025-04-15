import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react'
import { Helmet } from 'react-helmet'

import NewPassword from '@components/NewPassword/NewPassword'
import ButtonLoader from '@components/common/form/buttonLoader/ButtonLoader'

import useLogin from './hooks/useLogin'

type LoginFormData = {
  email: string
  password: string
}

const Login = () => {
  //custom hook for handlLogin
  const {
    handleLogin,
    redirectLogin,
    isTempPassword,
    setShowPassword,
    showPassword,
    studentSlug,
    register,
    handleSubmit,
    isLoading,
    handleOnClickForForgotPassoword,
  } = useLogin()

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data) //? Handle login logic here
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
        <NewPassword profile_slug={studentSlug} />
      ) : (
        <div className="flex h-[100dvh] flex-col">
          <main className="flex h-[100dvh] items-center justify-center bg-white px-4 shadow-soft">
            <div className="w-full max-w-md rounded-md bg-[#F7F7F7] p-8 text-black shadow-soft">
              <div className="flex flex-col items-start">
                <h2 className="mb-2 text-center text-3xl font-bold">
                  Welcome Back
                </h2>
                <h2 className="mb-6 text-center text-lg font-normal text-zinc-400">
                  Login to SmartRoll
                </h2>
              </div>
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
                      className="border-none pl-10 shadow-soft"
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
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...register('password', { required: true })}
                      className="border-none pl-10 pr-10 shadow-soft"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div
                    className="flex cursor-pointer justify-end text-sm text-zinc-400 hover:text-black hover:underline"
                    onClick={() => {
                      handleOnClickForForgotPassoword()
                    }}
                  >
                    Forgot Password ?
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/70"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ButtonLoader title="Logging In..." />
                  ) : (
                    <button>Login</button>
                  )}
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
