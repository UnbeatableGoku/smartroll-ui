import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@components/ui/button'

const DialogBox = ({
  open,
  setOpen,
  classRoomData,
  changeClassRoomAPI,
}: any) => {
  const [merge, setMerge] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle className="text-white">Edit classroom</DialogTitle>
        </DialogHeader>
        {classRoomData.details && (
          <div className="flex items-center space-x-2 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-2">
            <AlertTriangle className="size-6 text-yellow-600" />
            <p className="text-xs text-yellow-800">
              <span className="font-semibold">Warning:</span> This classroom is
              already associated with
              <span className="font-bold">
                {' '}
                {classRoomData.details.subject.subject_map.subject_name}{' '}
              </span>
              and teacher
              <span className="font-bold">
                {' '}
                {classRoomData.details.teacher.profile.name}{' '}
              </span>
              . Do you want to continue?
            </p>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={merge}
            onCheckedChange={() => {
              setMerge((prev) => !prev)
            }}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Do you want to merge this lecture ?
          </label>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false)
            }}
            className="text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              changeClassRoomAPI(
                merge,
                classRoomData.lecture_slug,
                classRoomData.classroom_slug,
              )
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogBox
