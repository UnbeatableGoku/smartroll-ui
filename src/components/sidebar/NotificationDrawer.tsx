import { useState } from 'react'
import { Bell} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,  
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import useNotification from './hooks/useNotification'

interface Notification {
    slug: string;
    status: string;
    type: string;
    message: string;
  }

const NotificationDrawer = () => {
    const [isOpen, setIsOpen] = useState(false)
    const {handleOnClickForNotifications,seenNotifications,unSeenNotifications,handleOnClickForMarkNotifications} = useNotification()
    

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(n => ({ ...n, read: true })))
//   }

  

  

  return (
    
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="group relative flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={()=>{handleOnClickForNotifications()}}
          >
            <Bell className="h-4 w-4" />
            {unSeenNotifications.length  > 0 && (
              <Badge variant="destructive" className="absolute top-1 right-[-4px] px-1 min-w-[1.25rem] h-5">
                {unSeenNotifications.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] sm:h-[60vh] overflow-y-auto">
          {/* <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader> */}
          <Tabs defaultValue="unread" className="w-full mt-4">
            <TabsList className="grid w-1/2 grid-cols-2 mx-auto">
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
           
            <TabsContent value="all">
              <ScrollArea className="h-[calc(60vh-10rem)] mt-4">
                {
                    seenNotifications.length > 0? (
                        seenNotifications.map(notification => (
                            <NotificationItem key={notification.slug} notification={notification} />
                        ))
                    ) : (<p className="text-center text-gray-500 py-4">No seen notifications</p>)
                }
                
              </ScrollArea>
            </TabsContent>
            <TabsContent value="unread">
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={()=>{handleOnClickForMarkNotifications()}}  className="mr-2 dark:text-white">
                Mark all as read
              </Button>
              
            </div>
              <ScrollArea className="h-[calc(60vh-10rem)] mt-4">
                {
                    unSeenNotifications.length > 0 ? (
                        unSeenNotifications.map(notification => (
                            <NotificationItem key={notification.slug} notification={notification} />
                        ))
                    ) : (<p className="text-center text-gray-500 py-4">No unread notifications</p>)
                }
               
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    
  )
}


const NotificationItem = ({ notification }: { notification: Notification }) => (
  <div className={`flex items-start space-x-4 p-4 ${notification.status === 'seen' ? 'opacity-60' : ''}`}>
    <div className={`w-2 h-2 mt-2 rounded-full ${notification.status === 'seen' ? 'bg-gray-300' : 'bg-blue-500'}`} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium dark:text-white">{notification.type}</p>
      <p className="text-sm text-gray-500">{notification.message}</p>
    </div>
    
  </div>
)

export default NotificationDrawer