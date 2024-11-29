import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Pencil, X } from 'lucide-react'


import { ProfileModalProps } from 'types/common'
import useStackHolderProfile from './hooks/useStackHolderProfile'

const StackholderProfile = ({ isOpen, onClose }: ProfileModalProps) => {
    

    const { isEditing,email,handleOnUpdateProfile,profile,setEmail,setIsEditing} = useStackHolderProfile()
    if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 relative">
      <Button
        className="absolute right-2 top-2 text-zinc-400 hover:text-white"
        variant="ghost"
        size="icon"
        onClick={()=>{setIsEditing(false);onClose();setEmail(profile?.obj.profile.email)}}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
      <CardHeader>
        {profile?.obj.profile.role =='admin' &&  <CardTitle className="text-2xl font-bold text-white">Branch-dmin Profile</CardTitle>}
        {profile?.obj.profile.role =='teacher' &&  <CardTitle className="text-2xl font-bold text-white">Faculty Profile</CardTitle>}
        {profile?.obj.profile.role =='student' &&  <CardTitle className="text-2xl font-bold text-white">Student Profile</CardTitle>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-2">
            {
                profile?.obj.profile.role == 'admin' && 
                  <>
                    <Label htmlFor="name" className="text-zinc-400">Admin Name</Label>
                    <div className="text-lg font-medium text-white">{profile.obj.profile.name}</div>
                  </>
            }
            
            {
                profile?.obj.profile.role == 'teacher' && 
                  <>
                    <Label htmlFor="name" className="text-zinc-400">Faculty Name</Label>
                    <div className="text-lg font-medium text-white">{profile.obj.profile.name}</div>
                  </>
            }
            {
                profile?.obj.profile.role == 'student' && 
                  <>
                    <Label htmlFor="name" className="text-zinc-400">Student Name</Label>
                    <div className="text-lg font-medium text-white">{profile.obj.profile.name}</div>
                  </>
            }
          </div>

          {profile?.obj.profile.role == 'student' && 
             <div className="space-y-2">
                <Label htmlFor="enrollment" className="text-zinc-400">Enrollment Number</Label>
                <div className="text-lg font-medium text-white">{profile.obj.enrollment}</div>
            </div>
          }

          <div className="space-y-2">
            <Label htmlFor="semester" className="text-zinc-400">Department</Label>
            <div className="text-lg font-medium text-white">{profile?.obj?.branch?.branch_name}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-400">Email ID</Label>
            <div className="flex items-center gap-4">
              {isEditing ? (
                <div className="flex-1 flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                  />
                  <Button
                    onClick={() => {handleOnUpdateProfile();setIsEditing(false)}}
                    variant="secondary"
                    className="bg-zinc-800 hover:bg-zinc-700 text-white"
                    disabled={profile?.obj.profile.email === email}
                  >
                    Update
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-lg font-medium text-white">{email}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit email</span>
                  </Button>
                </>
              )}
            </div>
              <div className='text-yellow-500'>Warning: You'll be logged out after updating your email</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
  )
}

export default StackholderProfile