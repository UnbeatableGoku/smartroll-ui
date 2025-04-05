// // import { useState } from 'react'
// import useSelectionForTeacher from '../../hooks/useSelectionForTeacher'
// import ConfirmSubjectSelection from '@pages/Subject/components/ConfirmSubjectSelection'
// import SubjectCard from '@pages/Subject/components/SubjectCard'
// import useSubjectSelection from '@pages/Subject/hooks/useSubjectSelection'
// import { AlertTriangle, BookOpen } from 'lucide-react'
// import { Helmet } from 'react-helmet'

// // import ConfirmSubjectSelection from '@pages/Subject/components/ConfirmSubjectSelection'
// // import SubjectCard from '@pages/Subject/components/SubjectCard'
// // import useSubjectSelection from '@pages/Subject/hooks/useSubjectSelection'
// // import { AlertTriangle, BookOpen } from 'lucide-react'
// // import { Helmet } from 'react-helmet'
// import Selection from '@components/common/form/selectiom/Selection'
// import { Alert, AlertTitle } from '@components/ui/alert'
// import { Button } from '@components/ui/button'
// import { Card, CardContent, CardHeader } from '@components/ui/card'
// import { Skeleton } from '@components/ui/skeleton'

// // import Selection from '@components/common/form/selectiom/Selection'
// // import { Alert, AlertTitle } from '@components/ui/alert'
// // import { Button } from '@components/ui/button'
// // import { Card, CardContent, CardHeader } from '@components/ui/card'
// // import { Skeleton } from '@components/ui/skeleton'

// // import useSelectionForTeacher from '../../hooks/useSelectionForTeacher'

// // ConfirmSubjectSelection

// const SubjectChoice = () => {
//   const { handleSubjectSelection } = useSubjectSelection()
//   // const SubjectChoice = () => {
//   //   const { handleSubjectSelection } = useSubjectSelection()

//   //   const {
//   //     loadSemesterByStreamForTeacher,
//   //     stream,
//   //     semesters,
//   //     selectedStream,
//   //     load_subjects_for_teacher_choice,
//   //     selectedSemester,
//   //     subjects,
//   //     toggleSubjectSelection,
//   //     selectedSubjects,
//   //     isSubjectLock,
//   //     noSubjectFoundCard,
//   //     onDrop,
//   //     setDraggedIndex,
//   //     save_teacher_subject_choice,
//   //     choice_deadline,
//   //     saveAsDraft,
//   //     setSaveAsDraft,
//   //     handleOnClickForUnsaveDraft
//   //   } = useSelectionForTeacher()

//   //   const [isPanelOpen, setIsPanelOpen] = useState(false)
//   //   const togglePanel = () => setIsPanelOpen(!isPanelOpen)

//   //   return (
//   //     <>
//   //       <Helmet>
//   //         <title>Smart Roll | Subject Choice</title>
//   //       </Helmet>
//   //       <div className="flex w-full flex-col space-y-4">
//   //         {/* time table selection */}

//   //         <div className="flex flex-col flex-wrap items-center justify-evenly space-y-5 lg:flex-col">
//   //           <div className="flex w-full flex-col items-center justify-center space-y-4 md:w-auto md:flex-row md:items-start md:space-x-8 md:space-y-0 lg:space-x-12">
//   //             {/* Stream Selection Card */}
//   //             {stream && (
//   //               <div className="relative w-full md:w-[240px] lg:w-[320px]">
//   //                 <Selection
//   //                   title="Stream"
//   //                   selectedValue={selectedStream}
//   //                   selectedValue2=" "
//   //                   onValueChange={loadSemesterByStreamForTeacher}
//   //                   placeholder="Select Stream"
//   //                   data={stream}
//   //                   optionTitle={null}
//   //                 />

//   //               {!isSubjectLock && !saveAsDraft &&
//   //                 <div>
//   //                   {/* Connecting Lines */}
//   //                   <div className="absolute right-[-2rem] top-1/2 hidden h-[3px] w-8 bg-gray-400 md:block lg:right-[-3rem] lg:w-12" />
//   //                   <div className="absolute bottom-[-1em] left-1/2 h-4 w-[3px] -translate-x-1/2 transform bg-gray-400 md:hidden" />
//   //                 </div>}

//   //             </div>

//   //           )}
//   //           {
//   // !isSubjectLock && !saveAsDraft &&
//   //             <div className="relative w-full md:w-[240px] lg:w-[320px]">
//   //               {/* Semester Selection Card */}

//   //                 <Selection
//   //                   title="Semester"
//   //                   selectedValue={selectedSemester}
//   //                   selectedValue2={selectedStream}
//   //                   onValueChange={load_subjects_for_teacher_choice}
//   //                   placeholder="Select Semester"
//   //                   data={semesters}
//   //                   optionTitle={'Semester'}
//   //                 />
//   //               </div>
//   //             }
//   //           </div>

//   //         {!isSubjectLock && !saveAsDraft && selectedSubjects.length > 0 &&
//   //           <Button onClick={togglePanel} className="mt-3 w-full lg:w-auto">
//   //             <BookOpen className="mr-2 h-4 w-4" />
//   //             View subject choices
//   //             <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-900">
//   //               {selectedSubjects.length}
//   //             </span>
//   //           </Button>}

//   //         {!isSubjectLock && saveAsDraft &&
//   //           <Button className="mt-3 w-full lg:w-auto"
//   //             onClick={handleOnClickForUnsaveDraft}
//   //           >
//   //             <BookOpen className="mr-2 h-4 w-4" />
//   //             Unsave Draft
//   //           </Button>}

//   //         {choice_deadline &&  !isSubjectLock &&
//   //           <Alert className="w-full border-yellow-500 bg-yellow-50 dark:border-red-400 dark:bg-red-900">
//   //             <div className="">
//   //               <AlertTitle className="flex items-center space-x-4 text-yellow-800 dark:text-white">
//   //                 <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
//   //                 <span>Decision Deadline : {choice_deadline} </span>
//   //               </AlertTitle>
//   //             </div>
//   //           </Alert>
//   //         }

//   //         <div className="group w-full hidden" ref={noSubjectFoundCard}>
//   //           <Card>
//   //             <CardHeader className="pb-2"></CardHeader>
//   //             <CardContent className="text-center">
//   //               No Subjects are available for this semester.
//   //             </CardContent>
//   //           </Card>
//   //         </div>

//   //         <div className="group w-full hidden" ref={noSubjectFoundCard}>
//   //           <Card>
//   //             <CardHeader className="pb-2"></CardHeader>
//   //             <CardContent className="text-center">
//   //             The deadline has passed, and you haven't selected any subjects.
//   //             </CardContent>
//   //           </Card>
//   //         </div>

//   //         <div className="w-full p-4">
//   //           {/* Check if subjects is null or loading */}
//   //           {subjects === null ? (
//   //             <div className="flex w-full flex-col items-center gap-4">
//   //               <Skeleton className="sm:h-18 h-20 w-full" />
//   //               <Skeleton className="sm:h-18 h-20 w-full" />
//   //               <Skeleton className="sm:h-18 h-20 w-full" />
//   //               <Skeleton className="sm:h-18 h-20 w-full" />
//   //               <Skeleton className="sm:h-18 h-20 w-full" />
//   //               <Skeleton className="sm:h-18 h-20 w-full" />
//   //               <Skeleton className="sm:h-18 h-20 w-full" />
//   //             </div>
//   //           ) : // If subjects is not null, display them in the grid
//   //             subjects.length > 0 ? (
//   //               <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//   //                 {subjects.map((subject, index) => (
//   //                   <SubjectCard
//   //                     key={index}
//   //                     subject={subject}
//   //                     toggleSubjectSelection={toggleSubjectSelection}
//   //                     selectedSubjects={selectedSubjects}
//   //                     isSubjectLock={saveAsDraft}
//   //                     setIsSubjectLock={setSaveAsDraft}
//   //                     draggable={true}
//   //                     index={index}
//   //                   />
//   //                 ))}
//   //               </div>
//   //             ) : (
//   //               <div className="group w-full">
//   //                 <Card>
//   //                   <CardHeader className="pb-2"></CardHeader>
//   //                   <CardContent className="text-center">
//   //                     No Subjects are available for this semester.
//   //                   </CardContent>
//   //                 </Card>
//   //               </div>
//   //             )}
//   //           </div>

//   //           <ConfirmSubjectSelection
//   //             isPanelOpen={isPanelOpen}
//   //             setIsPanelOpen={setIsPanelOpen}
//   //             togglePanel={togglePanel}
//   //             selectedSubjects={selectedSubjects}
//   //             handleSubjectSelection={handleSubjectSelection}
//   //             selectedSemester={selectedSemester}
//   //             draggable={true}
//   //             onDrop={onDrop}
//   //             setDraggedIndex={setDraggedIndex}
//   //             save_teacher_subject_choice={save_teacher_subject_choice}
//   //           ></ConfirmSubjectSelection>
//   //         </div>
//   //       </div>
//   //     </>
//   //   )
//   // }

//   // export default SubjectChoice

//   // import { useState } from "react";
//   // import {
//   //   DndContext,
//   //   KeyboardSensor,
//   //   PointerSensor,
//   //   useSensor,
//   //   useSensors,
//   //   closestCorners,
//   // } from "@dnd-kit/core";
//   // import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";

//   // import {

//   //   verticalListSortingStrategy,
//   // } from "@dnd-kit/sortable";

//   // import { restrictToParentElement } from "@dnd-kit/modifiers";
//   // import "./App.css";

//   // export default function App() {

//   //   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id});

//   //   const [tasks, setTasks] = useState([
//   //     { id: 1, title: "Add tests to homepage" },
//   //     { id: 2, title: "Fix styling in about section" },
//   //     { id: 3, title: "Learn how to center a div" },
//   //     { id: 4, title: "Another task example" },
//   //     { id: 5, title: "Test scrolling functionality" },
//   //   ]);

//   //   const addTask = (title:any) => {
//   //     setTasks((tasks) => [...tasks, { id: tasks.length + 1, title }]);
//   //   };

//   //   const sensors = useSensors(
//   //     useSensor(PointerSensor),
//   //     useSensor(KeyboardSensor, {
//   //       coordinateGetter: sortableKeyboardCoordinates,
//   //     })
//   //   );

//   //   const getTaskPos = (id:any) => tasks.findIndex((task) => task.id === id);

//   //   const handleDragEnd = (event:any) => {
//   //     const { active, over } = event;

//   //     if (!over || active.id === over.id) return;

//   //     setTasks((tasks) => {
//   //       const originalPos = getTaskPos(active.id);
//   //       const newPos = getTaskPos(over.id);

//   //       return arrayMove(tasks, originalPos, newPos);
//   //     });
//   //   };

//   //   return (
//   //     <div className="App">
//   //       <h1>My Tasks ✅</h1>
//   //       <Input onSubmit={addTask} />
//   //       <div className="scroll-container">
//   //         <DndContext
//   //           sensors={sensors}
//   //           collisionDetection={closestCorners}
//   //           modifiers={[restrictToParentElement]}
//   //           onDragEnd={handleDragEnd}
//   //           autoScroll={true}// Enable auto-scrolling near edges
//   //         >
//   //          <div className="column">
//   //             <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
//   //             {tasks.map((task) => (
//   //            <div
//   //            ref={setNodeRef}
//   //            style={style}
//   //            {...attributes}
//   //            {...listeners}
//   //            className="task"
//   //          >
//   //            <input type="checkbox" className="checkbox" />
//   //            {title}
//   //          </div>
//   //         ))}
//   //       </SortableContext>
//   //     </div>
//   //         </DndContext>
//   //       </div>
//   //     </div>
//   //   );
//   // }
// }
