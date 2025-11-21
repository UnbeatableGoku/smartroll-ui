import { Lock, X } from 'lucide-react'

import { Button } from '@components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card'
import { ScrollArea } from '@components/ui/scroll-area'

const ConfirmPanel = ({
  isPanelOpen,
  setIsPanelOpen,
  togglePanel,
  selectedSubjects,
  handleSubjectSelection,
  subjectChoicesSlug,
}: any) => {
  const onHandleClick = () => {
    const selected_slug = selectedSubjects.map((sub: any) => sub.subject.subject_obj_slug)
    handleSubjectSelection(selected_slug, subjectChoicesSlug)
    setIsPanelOpen(false)
  }
  return (
    <>
      {isPanelOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={togglePanel}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-full transform border-l bg-white shadow-soft transition-transform duration-300 ease-in-out sm:w-96 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">
                Selected Subjects
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-black/60 hover:text-black"
                onClick={() => {
                  setIsPanelOpen(!isPanelOpen)
                }}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close panel</span>
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {selectedSubjects?.map((subject: any) => (
                <Card
                  key={subject.subject?.slug}
                  className="group border-none bg-[#F7F7F7] shadow-soft"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold leading-none text-black">
                        {subject.subject?.subject_name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between text-sm text-black/60">
                      <span>
                        Subject Code - {subject.subject?.subject_code}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-black/60">
                    Type: {subject.subject?.category}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t border-gray-200 p-4">
            <Button
              className="w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
              size="lg"
              onClick={() => {
                onHandleClick()
              }}
            >
              <Lock className="mr-2 h-4 w-4" />
              Save Subjects
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
export default ConfirmPanel
