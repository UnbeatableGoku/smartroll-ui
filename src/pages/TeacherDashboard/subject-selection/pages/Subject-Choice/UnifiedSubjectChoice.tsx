import { useEffect} from 'react'
import useSelectionForTeacher from '../../hooks/useSelectionForTeacher'
import { Helmet } from 'react-helmet'
import { Button } from '@components/ui/button'
import { AlertTriangle, BookOpen } from 'lucide-react'
import { Alert, AlertTitle } from '@components/ui/alert'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'
import useUnifiedSubjectChoiceForTeacher from '../../hooks/useUnifiedSubjectChoiceForTeacher'
import SbujectDetailCard from '../../componets/SbujectDetailCard'
import ConfirmSubjectSelection from '@pages/Subject/components/ConfirmSubjectSelection'
import useSubjectSelection from '@pages/Subject/hooks/useSubjectSelection'

const UnifiedSubjectChoice = () => {
    const { handleSubjectSelection } = useSubjectSelection()
    const {
        noSubjectFoundCard,

    } = useSelectionForTeacher()

    

    // custom hooks to handle the teacher subject choice actios

    const { availableSubjects, deadLineData, saveSubjectDraft, saveSubjectFinalLock, savedSubjects, toggleSubjectSelection, onDrop, setDraggedIndex, save_teacher_subject_choice, moveSubject, handleOnClickForUnsaveDraft,similarSubjects,togglePanel,isPanelOpen,setIsPanelOpen,subjectList,activeSection,setActiveSection,onDragEnd,moveSubjectDrag} = useUnifiedSubjectChoiceForTeacher()

    useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(entry.target.id)
              }
            })
          },
          { threshold: 0.5 }
        )
    
        availableSubjects.forEach((item:any) => {
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

            <nav className="sticky text-center top-0 z-10 bg-black p-4 w-full">
        <div className="flex w-full mx-auto flex-wrap">
          {availableSubjects.map((item:any) => (
            <a
              key={item.id}
              href={`#${item.stream}`}
              className={`px-4 py-2 text-xs lg:text-lg font-bold ${
                activeSection === item.stream
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={(e) => {
                e.preventDefault()
                setActiveSection(item.stream)
                document.getElementById(item.stream)?.scrollIntoView({
                  behavior: 'smooth'
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

                {deadLineData && !saveSubjectFinalLock &&
                    <Alert className="w-full border-yellow-500 bg-yellow-50 dark:border-red-400 dark:bg-red-900">
                        <div className="">
                            <AlertTitle className="flex items-center space-x-4 text-yellow-800 dark:text-white">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                                <span>Decision Deadline : {deadLineData} </span>
                            </AlertTitle>
                        </div>
                    </Alert>
                }

                {!saveSubjectFinalLock && !saveSubjectDraft && savedSubjects.length > 0 &&
                    <Button className="mt-3 w-full"
                        onClick={togglePanel}
                    >
                        <BookOpen className="mr-2 h-4 w-4" />
                        View subject choices
                        <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-900">
                            {savedSubjects.filter((subject: any) =>!similarSubjects.some((similar: any) => similar.slug === subject.slug)).length}
                        </span>
                    </Button>}
                {!saveSubjectFinalLock && saveSubjectDraft &&
                    <Button className="mt-3 w-full"
                        onClick={handleOnClickForUnsaveDraft}
                    >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Unsave subject choice
                    </Button>}
                <div className="group w-full hidden" ref={noSubjectFoundCard}>
                    <Card>
                        <CardHeader className="pb-2"></CardHeader>
                        <CardContent className="text-center">
                            No Subjects are available for this semester.
                        </CardContent>
                    </Card>

                </div>
                <div className="group w-full hidden" ref={noSubjectFoundCard}>
                    <Card>
                        <CardHeader className="pb-2"></CardHeader>
                        <CardContent className="text-center">
                            The deadline has passed, and you haven't selected any subjects.
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full p-4">
                    {/* Check if availableSubjects is empty */}
                    {availableSubjects.length === 0 ? (
                        <div className="flex w-full flex-col items-center gap-4">
                            <Skeleton className="sm:h-18 h-20 w-full" />
                            <Skeleton className="sm:h-18 h-20 w-full" />
                            <Skeleton className="sm:h-18 h-20 w-full" />
                            <Skeleton className="sm:h-18 h-20 w-full" />
                            <Skeleton className="sm:h-18 h-20 w-full" />
                            <Skeleton className="sm:h-18 h-20 w-full" />
                            <Skeleton className="sm:h-18 h-20 w-full" />
                        </div>
                    ) : (
                        // Render available subjects
                        availableSubjects.map((stream: any) => (
                            <div key={stream.stream} className='rounded-sm mb-14'>
                                <div className='text-2xl lg:text-4xl font-extrabold px-2 py-10 text-center' id={stream.stream}>{stream.stream}</div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 px-2 py-2">
                                    {stream.subjects.map((subject: any, subjectIndex: number) => (
                                        <SbujectDetailCard
                                            key={subject.slug} // Ensure slug is unique
                                            subject={subject}
                                            toggleSubjectSelection={toggleSubjectSelection}
                                            selectedSubjects={savedSubjects}
                                            isSubjectLock={saveSubjectDraft}
                                            setIsSubjectLock={saveSubjectDraft}
                                            index={subjectIndex}
                                            similarSubjects = {similarSubjects}
                                        />
                                    ))}
                                </div>

                            </div>
                        ))
                    )}
                </div>


                {subjectList.length > 0 && <ConfirmSubjectSelection
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
                    similarSubjects = {similarSubjects}
                    subjectList = {subjectList}
                    onDragEnd ={onDragEnd}
                    moveSubjectDrag={moveSubjectDrag}
                    
                ></ConfirmSubjectSelection>}
            </div>
        </>
    )
}

export default UnifiedSubjectChoice