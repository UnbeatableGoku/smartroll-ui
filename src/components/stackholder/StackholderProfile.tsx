import { Label } from '@radix-ui/react-label'
import { Pencil, X } from 'lucide-react'

import { ProfileModalProps } from 'types/common'

import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Input } from '@components/ui/input'

import useStackHolderProfile from './hooks/useStackHolderProfile'

const StackholderProfile = ({ isOpen, onClose }: ProfileModalProps) => {
  const {
    isEditing,
    email,
    handleOnUpdateProfile,
    profile,
    setEmail,
    setIsEditing,
  } = useStackHolderProfile()
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      style={{ pointerEvents: 'auto' }}
    >
      <Card className="relative w-full max-w-2xl border-none bg-[#FFFFFF] shadow-soft">
        <Button
          className="absolute right-2 top-2 text-black hover:bg-none"
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsEditing(false)
            onClose()
            setEmail(profile?.obj.profile.email)
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <CardHeader>
          {profile?.obj.profile.role == 'admin' && (
            <CardTitle className="text-2xl font-bold text-black">
              Branch-dmin Profile
            </CardTitle>
          )}
          {profile?.obj.profile.role == 'teacher' && (
            <CardTitle className="text-2xl font-bold text-black">
              Faculty Profile
            </CardTitle>
          )}
          {profile?.obj.profile.role == 'student' && (
            <CardTitle className="text-2xl font-bold text-black">
              Student Profile
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              {profile?.obj.profile.role == 'admin' && (
                <>
                  <Label htmlFor="name" className="text-zinc-400">
                    Admin Name
                  </Label>
                  <div className="text-sm font-medium text-black md:text-lg">
                    {profile.obj.profile.name}
                  </div>
                </>
              )}

              {profile?.obj.profile.role == 'teacher' && (
                <>
                  <Label htmlFor="name" className="text-zinc-400">
                    Faculty Name
                  </Label>
                  <div className="text-sm font-medium text-black md:text-lg">
                    {profile.obj.profile.name}
                  </div>
                </>
              )}
              {profile?.obj.profile.role == 'student' && (
                <>
                  <Label htmlFor="name" className="text-zinc-400">
                    Student Name
                  </Label>
                  <div className="text-sm font-medium text-black md:text-lg">
                    {profile.obj.profile.name}
                  </div>
                </>
              )}
            </div>

            {profile?.obj.profile.role == 'student' && (
              <div className="space-y-2">
                <Label htmlFor="enrollment" className="text-zinc-400">
                  Enrollment Number
                </Label>
                <div className="text-sm font-medium text-black md:text-lg">
                  {profile.obj.enrollment}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="semester" className="text-zinc-400">
                Department
              </Label>
              <div className="text-sm font-medium text-black md:text-lg">
                {profile?.obj?.branch?.branch_name}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400">
                Email ID
              </Label>
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <div className="flex flex-1 gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 border-none bg-white text-black shadow-soft"
                    />
                    <Button
                      onClick={() => {
                        handleOnUpdateProfile()
                        setIsEditing(false)
                      }}
                      variant="secondary"
                      className="bg-[#e9e9e9] text-black shadow-soft hover:bg-white"
                      disabled={profile?.obj.profile.email === email}
                    >
                      Update
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-black md:text-lg">
                      {email}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8 text-black hover:bg-[#e6e5e5] hover:text-black"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit email</span>
                    </Button>
                  </>
                )}
              </div>
              <div className="text-sm text-yellow-500 md:text-xs">
                Warning: You'll be logged out after updating your email
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StackholderProfile
