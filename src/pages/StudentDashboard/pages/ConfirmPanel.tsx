import useElectiveSubject from '../hooks/useElectiveSubject'
import { Lock, X } from 'lucide-react'

import ButtonLoader from '@components/common/form/buttonLoader/ButtonLoader'
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
  subjectSlug,
}: any) => {
  const { isLoading } = useElectiveSubject()
  // const { categorySelectionStatus } = useSubjectSelection()
  const onHandleClick = () => {
    const selectedChoices = selectedSubjects.subject_choices

    handleSubjectSelection(selectedChoices, subjectSlug)
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
        className={`fixed inset-y-0 right-0 z-30 w-full transform border-l bg-background/80 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out sm:w-96 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Selected Subjects</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
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
              {selectedSubjects?.subject_details?.map((subject: any) => (
                <Card key={subject.slug} className="group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold leading-none">
                        {subject.subject_name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Subject Code - {subject.subject_code}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground">
                    Type: {subject.category}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                onHandleClick()
              }}
            >
              <Lock className="mr-2 h-4 w-4" />
              {isLoading ? (
                <ButtonLoader title="Locking..." />
              ) : (
                'Lock Subjects'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
export default ConfirmPanel
