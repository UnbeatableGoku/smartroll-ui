import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, LockKeyhole } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import ButtonLoader from '@components/common/form/buttonLoader/ButtonLoader'

import useNewPassword from './hooks/useNewPassword'

interface NewPasswordProps {
  profile_slug: string
}

type LoginFormData = {
  password: string
  confirmPassword: string
}

const NewPassword = ({ profile_slug }: NewPasswordProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // Initialize the form with react-hook-form
  const { register, handleSubmit } = useForm<LoginFormData>()

  const { handleNewPassword } = useNewPassword()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    const { password, confirmPassword } = data
    
    // Check if the passwords match
    if (password !== confirmPassword) {
      setIsLoading(false)
      return toast.error('Passwords do not match')
      
    } else {
      // Call the handleNewPassword function to update the password
      try {
        const response = await handleNewPassword({ password, profile_slug })
        if (!response?.success) {
          setIsLoading(!isLoading)
        }
      } catch (e) {
        toast.error('An error occurred while updating the password' + e)
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div>
      <Helmet>
        <title>Smart Roll | New Password</title>
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <main className="flex flex-grow items-center justify-center bg-black">
          <div className="w-full max-w-md rounded-lg bg-background p-8 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold">
              New Password
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Enter your confirm password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                    })}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <ButtonLoader title="Updating..." />
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default NewPassword
