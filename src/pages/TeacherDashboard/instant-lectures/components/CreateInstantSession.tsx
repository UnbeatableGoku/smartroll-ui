import { useState } from 'react'

import { IinstantSession, InstantSessionMetataData } from '../types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { RootState } from '@data/Store'
import { useSelector } from 'react-redux'

import { cn } from '@lib/utils'

import { SheetLoader } from '@components/common/loader/Loader'
import { Input } from '@components/ui/input'

const CreateInstantSession = ({
  isSheetOpen,
  setIsSheetOpen,
  instantSession,
  handleInstantSessionChange,
  instantSessionMetadata,
  fetchInstantSessionMetadata,
  clearInstantSessionData,
  createInstantSessionAPI,
}: props) => {
  const [titleOption, setTitleOption] = useState<'subject' | 'custom'>('custom')
  const sheetLoader = useSelector(
    (state: RootState) => state.loader.SHEET_LOADER_STATE,
  )

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="flex w-full flex-col sm:w-[400px] md:w-[600px] md:max-w-md">
        <SheetHeader className="flex-shrink-0 pb-3">
          <SheetTitle className="text-lg">
            Create Instant Lecture Session
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-2">
          <FormSection>
            <Label className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-submit text-xs text-primary-foreground">
                1
              </span>
              Select Branch
            </Label>
            <div className="grid grid-cols-2 gap-1.5">
              {instantSessionMetadata.branches.map((branch) => (
                <Button
                  key={branch.value}
                  variant={
                    instantSession.branch === branch.value
                      ? 'submit-outline'
                      : 'outline'
                  }
                  className={cn(
                    'h-8 w-full justify-start truncate px-3 text-sm',
                  )}
                  onClick={() => {
                    handleInstantSessionChange('branch', branch.value, {
                      divisions: [],
                      semester: '',
                      subject: '',
                      title: '',
                      batches: [],
                    })
                    fetchInstantSessionMetadata({ branch: branch.value })
                  }}
                  title={branch.label}
                >
                  <span className="truncate font-normal">{branch.label}</span>
                </Button>
              ))}
            </div>
          </FormSection>
          <Separator />

          {instantSession.branch && (
            <FormSection>
              <Label className="flex items-center gap-2 text-sm font-medium">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-submit text-xs text-primary-foreground">
                  2
                </span>
                Select Semester
              </Label>
              <div className="grid grid-cols-4 gap-1.5">
                {instantSessionMetadata.semesters.map((semester) => (
                  <Button
                    key={semester.value}
                    variant={
                      instantSession.semester === semester.value
                        ? 'submit-outline'
                        : 'outline'
                    }
                    className="h-8 w-full justify-center truncate px-1 text-sm"
                    onClick={() => {
                      handleInstantSessionChange('semester', semester.value, {
                        divisions: [],
                        subject: '',
                        title: '',
                        batches: [],
                      })
                      fetchInstantSessionMetadata({ semester: semester.value })
                    }}
                    title={semester.label}
                  >
                    <span className="truncate font-normal">
                      {semester.label}
                    </span>
                  </Button>
                ))}
              </div>
            </FormSection>
          )}

          {instantSession.semester && (
            <>
              <div className="border-t pt-3">
                <Label className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-submit text-xs text-primary-foreground">
                    3
                  </span>
                  Session Details
                </Label>
              </div>

              <FormSection>
                <Label className="text-sm font-medium">Select Divisions</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {instantSessionMetadata.divisions.map((division) => (
                    <Button
                      key={division.value}
                      variant={
                        instantSession.divisions.includes(division.value)
                          ? 'submit-outline'
                          : 'outline'
                      }
                      className="h-8 w-full justify-center truncate px-1 text-sm"
                      onClick={() => {
                        const isInclude = instantSession.divisions.includes(
                          division.value,
                        )
                        const remainLen =
                          instantSession.divisions.length +
                          (isInclude ? -1 : -0)
                        if (
                          !isInclude &&
                          instantSession.divisions.length === 0
                        ) {
                          fetchInstantSessionMetadata({
                            division: division.value,
                          })
                        }
                        if (isInclude && remainLen === 1) {
                          fetchInstantSessionMetadata({
                            division: instantSession.divisions.at(-1),
                          })
                        }
                        handleInstantSessionChange('divisions', division.value)
                      }}
                      title={division.label}
                    >
                      <span className="truncate font-normal">
                        {division.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </FormSection>

              {instantSession.divisions.length === 1 && (
                <FormSection>
                  <Label className="text-sm font-medium">Select Batch</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {instantSessionMetadata.batches.map((batch) => (
                      <Button
                        key={batch.value}
                        variant={
                          instantSession.batches.includes(batch.value)
                            ? 'submit-outline'
                            : 'outline'
                        }
                        className="h-8 w-full justify-center truncate px-1 text-sm"
                        onClick={() => {
                          handleInstantSessionChange('batches', batch.value)
                        }}
                        title={batch.label}
                      >
                        <span className="truncate font-normal">
                          {batch.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                </FormSection>
              )}

              <FormSection>
                <Label className="text-sm font-medium">Session Title</Label>
                <div className="space-y-2 px-1">
                  <div className="flex gap-1.5">
                    <Button
                      variant={titleOption === 'custom' ? 'submit' : 'outline'}
                      className="h-8 w-full flex-1 truncate text-xs"
                      onClick={() => setTitleOption('custom')}
                      title="Custom Title"
                    >
                      <span className="truncate font-normal">Custom Title</span>
                    </Button>
                    <Button
                      variant={titleOption === 'subject' ? 'submit' : 'outline'}
                      className="h-8 w-full flex-1 truncate text-xs"
                      onClick={() => setTitleOption('subject')}
                      title="Use Subject"
                    >
                      <span className="truncate">Use Subject</span>
                    </Button>
                  </div>

                  {titleOption === 'custom' && (
                    <Input
                      placeholder="Enter session title..."
                      value={instantSession.title}
                      onChange={(e) =>
                        handleInstantSessionChange('title', e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                  )}
                </div>
                <Separator />
              </FormSection>

              {titleOption === 'subject' && (
                <FormSection>
                  <div className="grid grid-cols-2 gap-1.5">
                    {instantSessionMetadata.subjects.map((subject) => (
                      <Button
                        key={subject.value}
                        variant={
                          instantSession.subject === subject.value
                            ? 'submit-outline'
                            : 'outline'
                        }
                        className="h-8 w-full justify-start truncate px-3 text-sm"
                        onClick={() =>
                          handleInstantSessionChange('subject', subject.value)
                        }
                        title={subject.label}
                      >
                        <span className="truncate font-normal">
                          {subject.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                  <Separator />
                </FormSection>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 border-t pt-3 md:flex-row md:space-x-2 md:space-y-0">
          <Button
            onClick={createInstantSessionAPI}
            disabled={
              (!instantSession.branch ||
                !instantSession.semester ||
                !instantSession.divisions.length) &&
              (!instantSession.subject || !instantSession.title)
            }
            className="h-9 w-full bg-submit text-sm text-primary-foreground hover:bg-submit/90"
          >
            Create Instant Session
          </Button>
          <Button
            onClick={() => {
              clearInstantSessionData()
              setTitleOption('custom')
            }}
            variant="outline"
            className="h-9 w-full bg-transparent text-sm"
          >
            Clear All
          </Button>
        </div>
        {sheetLoader && <SheetLoader></SheetLoader>}
      </SheetContent>
    </Sheet>
  )
}

const FormSection = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
)

interface props {
  isSheetOpen: boolean
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
  instantSession: IinstantSession
  handleInstantSessionChange: any
  instantSessionMetadata: InstantSessionMetataData
  handleInputValueChange: any
  fetchInstantSessionMetadata: any
  clearInstantSessionData: any
  createInstantSessionAPI: any
}
export default CreateInstantSession
