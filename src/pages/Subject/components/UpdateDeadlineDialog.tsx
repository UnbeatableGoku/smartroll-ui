import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SaveAll } from 'lucide-react'

const UpdateDeadlineDialog = ({
  deadline,
  setDeadLine,
  handleOnClickToUpdateDeadline,
  openDeadlineDailog,
  setOpenDeadlineDailog,
}: any) => {
  return (
    <div className="mt-3 w-full">
      <Dialog open={openDeadlineDailog} onOpenChange={setOpenDeadlineDailog}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
          >
            Extend Deadline
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-black">Deadline Extend</DialogTitle>
            <DialogDescription className="text-black/60">
              Extend deadline for the subject selection
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Set new date
              </Label>
              <Input
                id="link"
                type="date"
                value={deadline}
                className="border-[#0261BE] bg-white text-black"
                onChange={(e) => {
                  setDeadLine(e.target.value)
                }}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="bg-[#0261BE] px-3 text-white hover:bg-[#0261BE]/80"
              onClick={handleOnClickToUpdateDeadline}
            >
              <span className="sr-only">Save Date</span>
              <SaveAll />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateDeadlineDialog
