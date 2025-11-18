import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import logo from '@assets/images/smartroll.png'
import { Edit2, Save, X } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PAGE_DASHBOARD } from '@constants'

import AdverticementBar from '@components/adverticementBar'
import useStackHolderProfile from '@components/stackholder/hooks/useStackHolderProfile'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    isEditing,
    profile,
    email,
    handleOnUpdateProfile,
    setEmail,
    setIsEditing,
    handelLogout,
  } = useStackHolderProfile()

  const handleCancel = () => {
    setEmail(profile?.obj.profile.email)
    setIsEditing(false)
  }

  return (
    <>
      <AdverticementBar />
      <header className="header-top relative flex w-full items-center justify-between border-b-0 bg-[#F7F7F7] px-4 py-3 md:px-10">
        {/* Logo on far left */}
        <div className="h-8">
          <Link to={PAGE_DASHBOARD.path}>
            <img
              src={logo}
              alt="logo"
              className="h-full w-auto object-contain"
            />
          </Link>
        </div>

        {/* Spacer to push avatar right only on desktop */}
        <div className="hidden flex-1 md:block" />

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild className="cursor-pointer">
            <div className="flex items-center gap-2 md:ml-auto">
              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm">
                {profile?.obj.profile.role === 'teacher'
                  ? profile?.obj.teacher_code?.substring(0, 2)?.toUpperCase()
                  : profile?.obj.profile.name
                      ?.split(' ')
                      .map((word: any) => word[0]?.toUpperCase())
                      .join('')}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4">
              <div className="mb-3 flex items-center space-x-3">
                <div className="flex items-center gap-2 md:ml-auto">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm">
                    {profile?.obj.profile.role === 'teacher'
                      ? profile?.obj.teacher_code
                          ?.substring(0, 2)
                          ?.toUpperCase()
                      : profile?.obj.profile.name
                          ?.split(' ')
                          .map((word: any) => word[0]?.toUpperCase())
                          .join('')}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {profile?.obj.profile.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {profile?.obj.profile.role}
                  </p>
                </div>
              </div>

              <Separator className="my-3" />
              <div className="space-y-3">
                <div className="flex flex-col space-y-3">
                  <Label>Branch</Label>
                  <p className="break-all text-sm text-gray-600">
                    {profile?.obj.branch.branch_name}
                  </p>
                </div>
              </div>

              <Separator className="my-3" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  {!isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit email</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleOnUpdateProfile}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                        disabled={profile?.obj.profile.email === email}
                      >
                        <Save className="h-4 w-4" />
                        <span className="sr-only">Save email</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cancel edit</span>
                      </Button>
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <p className="break-all text-sm text-gray-600">
                    {profile?.obj.profile.email}
                  </p>
                ) : (
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-sm"
                    placeholder="Enter email address"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleOnUpdateProfile()
                      } else if (e.key === 'Escape') {
                        handleCancel()
                      }
                    }}
                    autoFocus
                  />
                )}
              </div>
              <Separator className="my-3" />
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start bg-red-500 text-sm text-white hover:bg-red-600 hover:text-white"
                  onClick={handelLogout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </header>
    </>
  )
}

export default Header
