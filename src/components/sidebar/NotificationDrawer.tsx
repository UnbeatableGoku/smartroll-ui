import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell } from 'lucide-react'

import { Separator } from '@components/ui/separator'

import useNotification from './hooks/useNotification'

interface Notification {
  slug: string
  status: string
  type: string
  message: string
  type_code: string
}

const NotificationDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    handleOnClickForNotifications,
    seenNotifications,
    unSeenNotifications,
    handleOnClickForMarkNotifications,
    replaceLink,
  } = useNotification()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="group relative flex h-11 w-11 items-center justify-center rounded-md text-black transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-white/10 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={() => {
            handleOnClickForNotifications()
          }}
        >
          <Bell className="size-5" />
          {unSeenNotifications.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute right-[-4px] top-1 h-5 min-w-[1.25rem] justify-around px-1"
            >
              <p>{unSeenNotifications.length}</p>
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[80vh] overflow-y-auto bg-[#F7F7F7] sm:h-[60vh]"
      >
        {/* <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader> */}
        <Tabs defaultValue="unread" className="mt-4 w-full bg-[#F7F7F7]">
          <TabsList className="mx-auto grid w-1/2 grid-cols-2 gap-4 bg-[#F7F7F7]">
            <TabsTrigger
              value="unread"
              className="rounded-[6px] bg-white text-black shadow-soft data-[state=active]:bg-[#0261BE] data-[state=active]:text-white"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="rounded-[6px] bg-white text-black shadow-soft data-[state=active]:bg-[#0261BE] data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="mt-4 h-[calc(60vh-10rem)]">
              {seenNotifications.length > 0 ? (
                seenNotifications.map((notification: any) => (
                  <NotificationItem
                    key={notification.slug}
                    notification={notification}
                    replace={replaceLink}
                  />
                ))
              ) : (
                <p className="py-4 text-center text-gray-500">
                  No seen notifications
                </p>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread">
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleOnClickForMarkNotifications()
                }}
                className="mr-2 border-none bg-[#0261BE] text-white shadow-soft"
              >
                Mark all as read
              </Button>
            </div>
            <ScrollArea className="mt-4 h-[calc(60vh-10rem)]">
              {unSeenNotifications.length > 0 ? (
                unSeenNotifications.map((notification: any) => (
                  <>
                    <NotificationItem
                      key={notification.slug}
                      notification={notification}
                      replace={replaceLink}
                    />
                    <Separator></Separator>
                  </>
                ))
              ) : (
                <p className="py-4 text-center text-gray-500">
                  No unread notifications
                </p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

const NotificationItem = ({
  notification,
  replace,
}: {
  notification: Notification
  replace: any
}) => (
  <div
    className={`flex items-start space-x-4 p-4 ${notification.status === 'seen' ? 'opacity-60' : ''}`}
  >
    <div
      className={`mt-2 h-2 w-2 rounded-full ${notification.status === 'seen' ? 'bg-gray-300' : 'bg-blue-500'}`}
    />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium dark:text-white">{notification.type}</p>
      <p className="text-sm font-medium dark:text-white">
        {replace(notification.message, notification.type_code)}
      </p>
    </div>
  </div>
)

export default NotificationDrawer
