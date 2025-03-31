import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import AllocatedSubject from './components/AllocatedSubject'
import { NonAllocatedSubjects } from './components/NonAllocatedSubjects'

// const teacherData = [
//   {
//     id: 242424,
//     name: 'Prof. Dr. Hetal Joshiyara ',
//     subjects: [
//       { name: 'DBMS', theoryHours: 3, practicalHours: 2, division: 'A' },
//       { name: 'AJP', theoryHours: 2, practicalHours: 3, division: 'B' },
//     ],
//   },
//   {
//     id: 4224,
//     name: 'Prof. Johnson',
//     subjects: [
//       {
//         name: 'Data Structures',
//         theoryHours: 3,
//         practicalHours: 2,
//         division: 'A',
//       },
//       { name: 'Algorithms', theoryHours: 3, practicalHours: 1, division: 'B' },
//     ],
//   },
//   {
//     id: 333,
//     name: 'Prof. Smith',
//     subjects: [
//       {
//         name: 'Web Development',
//         theoryHours: 2,
//         practicalHours: 3,
//         division: 'A',
//       },
//       {
//         name: 'Mobile App Development',
//         theoryHours: 2,
//         practicalHours: 2,
//         division: 'B',
//       },
//     ],
//   },
// ]

// const nonAllocatedSubjects = [
//   {
//     name: 'Machine Learning',
//     remainingTheoryHours: 3,
//     remainingPracticalHours: 2,
//     totalTheoryHours: 4,
//     totalPracticalHours: 3,
//   },
//   {
//     name: 'Computer Networks',
//     remainingTheoryHours: 2,
//     remainingPracticalHours: 1,
//     totalTheoryHours: 3,
//     totalPracticalHours: 2,
//   },
//   {
//     name: 'Operating Systems',
//     remainingTheoryHours: 4,
//     remainingPracticalHours: 2,
//     totalTheoryHours: 4,
//     totalPracticalHours: 3,
//   },
// ]

const TeacherAllocation = () => {
  // const [expandedTeacher, setExpandedTeacher] = useState<number | null>(null)
  // const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  // const toggleTeacher = (teacherId: number) => {
  //   setExpandedTeacher((prev) => (prev === teacherId ? null : teacherId))
  // }
  return (
    <div className="dark p-4">
      <Tabs defaultValue="allocated" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="allocated">Allocated Subjects</TabsTrigger>
          <TabsTrigger value="non-allocated">
            Non-Allocated Subjects
          </TabsTrigger>
        </TabsList>
        <TabsContent value="allocated">
          <AllocatedSubject />
        </TabsContent>
        <TabsContent value="non-allocated">
          <NonAllocatedSubjects />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TeacherAllocation
