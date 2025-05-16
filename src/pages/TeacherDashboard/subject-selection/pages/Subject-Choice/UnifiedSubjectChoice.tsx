import { useEffect } from 'react'

import SbujectDetailCard from '../../componets/SbujectDetailCard'
import useSelectionForTeacher from '../../hooks/useSelectionForTeacher'
import useUnifiedSubjectChoiceForTeacher from '../../hooks/useUnifiedSubjectChoiceForTeacher'
import ConfirmSubjectSelection from '@pages/Subject/components/ConfirmSubjectSelection'
import useSubjectSelection from '@pages/Subject/hooks/useSubjectSelection'
import { AlertTriangle, BookOpen } from 'lucide-react'
import { Helmet } from 'react-helmet'

import { Alert, AlertTitle } from '@components/ui/alert'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'

const UnifiedSubjectChoice = () => {
  const { handleSubjectSelection } = useSubjectSelection()
  const { noSubjectFoundCard } = useSelectionForTeacher()

  const {
    availableSubjects,
    deadLineData,
    saveSubjectDraft,
    saveSubjectFinalLock,
    savedSubjects,
    toggleSubjectSelection,
    onDrop,
    setDraggedIndex,
    save_teacher_subject_choice,
    moveSubject,
    handleOnClickForUnsaveDraft,
    similarSubjects,
    togglePanel,
    isPanelOpen,
    setIsPanelOpen,
    subjectList,
    activeSection,
    setActiveSection,
    onDragEnd,
    moveSubjectDrag,
  } = useUnifiedSubjectChoiceForTeacher()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    availableSubjects.forEach((item: any) => {
      const element = document.getElementById(item.stream)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [availableSubjects])

  return (
    <>
      <Helmet>
        <title>Smart Roll | Subject Choice</title>
      </Helmet>
      <div className="flex flex-col flex-wrap items-center justify-evenly space-y-5 lg:flex-col">
        <nav className="sticky top-0 z-10 w-full border-b border-zinc-600/50 bg-[#F7F7F7]/40 p-4 text-center backdrop-blur-lg">
          <div className="mx-auto flex w-full flex-wrap">
            {availableSubjects.map((item: any) => (
              <a
                key={item.id}
                href={`#${item.stream}`}
                className={`px-4 py-2 text-xs font-bold lg:text-lg ${
                  activeSection === item.stream
                    ? 'border-b-2 border-[#0261BE] text-[#0261BE]'
                    : 'text-black hover:text-[#0261BE]'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveSection(item.stream)
                  document.getElementById(item.stream)?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
              >
                {item.stream}
              </a>
            ))}
          </div>
        </nav>

        {/* <div className=''>
            <FilterOption availableSubjects={availableSubjects}></FilterOption>
            </div> */}

        {deadLineData && !saveSubjectFinalLock && (
          <Alert className="w-full border-[#F99704] bg-white text-black shadow-soft">
            <div className="">
              <AlertTitle className="flex items-center space-x-4">
                <AlertTriangle className="h-4 w-4 text-[#F99704]" />
                <span>Decision Deadline : {deadLineData} </span>
              </AlertTitle>
            </div>
          </Alert>
        )}

        {!saveSubjectFinalLock &&
          !saveSubjectDraft &&
          savedSubjects.length > 0 && (
            <Button
              className="mt-3 w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
              onClick={togglePanel}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              View subject choices
              <span className="ml-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-[#0261BE]">
                {
                  savedSubjects.filter(
                    (subject: any) =>
                      !similarSubjects.some(
                        (similar: any) => similar.slug === subject.slug,
                      ),
                  ).length
                }
              </span>
            </Button>
          )}
        {!saveSubjectFinalLock && saveSubjectDraft && (
          <Button
            className="mt-3 w-full bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
            onClick={handleOnClickForUnsaveDraft}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Unsave subject choice
          </Button>
        )}
        <div className="group hidden w-full" ref={noSubjectFoundCard}>
          <Card className="border-none bg-[#F7F7F7] shadow-soft">
            <CardHeader className="pb-2"></CardHeader>
            <CardContent className="text-center text-black">
              No Subjects are available for this semester.
            </CardContent>
          </Card>
        </div>
        <div className="group hidden w-full" ref={noSubjectFoundCard}>
          <Card className="border-none bg-[#F7F7F7] shadow-soft">
            <CardHeader className="pb-2"></CardHeader>
            <CardContent className="text-center text-black">
              The deadline has passed, and you haven't selected any subjects.
            </CardContent>
          </Card>
        </div>

        <div className="w-full p-4">
          {/* Check if availableSubjects is empty */}
          {availableSubjects.length === 0 ? (
            <div className="flex w-full flex-col items-center gap-4">
              <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
              <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
              <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
              <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
              <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
              <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
              <Skeleton className="sm:h-18 h-20 w-full bg-[#F7F7F7]" />
            </div>
          ) : (
            // Render available subjects
            availableSubjects.map((stream: any) => (
              <div key={stream.stream} className="mb-14 rounded-sm">
                <div
                  className="px-2 py-10 text-center text-2xl font-extrabold text-black lg:text-4xl"
                  id={stream.stream}
                >
                  {stream.stream}
                </div>
                <div className="grid grid-cols-1 gap-4 px-2 py-2 md:grid-cols-2 lg:grid-cols-3">
                  {stream.subjects.map((subject: any, subjectIndex: number) => (
                    <SbujectDetailCard
                      key={subject.slug} // Ensure slug is unique
                      subject={subject}
                      toggleSubjectSelection={toggleSubjectSelection}
                      selectedSubjects={savedSubjects}
                      isSubjectLock={saveSubjectDraft}
                      setIsSubjectLock={saveSubjectDraft}
                      index={subjectIndex}
                      similarSubjects={similarSubjects}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {subjectList.length > 0 && (
          <ConfirmSubjectSelection
            isPanelOpen={isPanelOpen}
            setIsPanelOpen={setIsPanelOpen}
            togglePanel={togglePanel}
            selectedSubjects={savedSubjects}
            handleSubjectSelection={handleSubjectSelection}
            draggable={true}
            onDrop={onDrop}
            setDraggedIndex={setDraggedIndex}
            save_teacher_subject_choice={save_teacher_subject_choice}
            moveSubject={moveSubject}
            similarSubjects={similarSubjects}
            subjectList={subjectList}
            onDragEnd={onDragEnd}
            moveSubjectDrag={moveSubjectDrag}
          ></ConfirmSubjectSelection>
        )}
      </div>
    </>
  )
}

export default UnifiedSubjectChoice
