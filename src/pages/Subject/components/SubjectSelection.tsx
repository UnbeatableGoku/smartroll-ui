import { useEffect, useState } from 'react'

import Selection from '@/components/common/form/selectiom/Selection'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useSubjectStore } from '@/store/subjectStore'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const SubjectSelection = () => {
  const navigate = useNavigate()
  const { subjects, updateSubject } = useSubjectStore()
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  useEffect(() => {
    if (subjects.length === 0) {
      toast.error('Please add subjects first')
      navigate('/subject')
    }
  }, [subjects])

  const handleOnClickToAddSubject = (subjectId: string) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId))
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId])
    }
  }

  const handleOnClickToSaveSubjects = () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject')
      return
    }

    updateSubject(selectedSubjects)
    toast.success('Subjects saved successfully')
    navigate('/subject/teacher-allocation')
  }

  return (
    <div className="min-h-screen w-full bg-white px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-[#0261BE] hover:bg-[#0261BE]/10"
            onClick={() => navigate(-1)}
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-black">
              Subject Selection
            </h1>
            <p className="text-black/60">
              Select subjects that will be offered to students
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <Card className="bg-[#F7F7F7] p-6 shadow-soft">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <Card
                  key={subject.id}
                  className={`cursor-pointer bg-white p-4 shadow-soft transition-all hover:shadow-md ${
                    selectedSubjects.includes(subject.id)
                      ? 'border-[#0261BE]'
                      : 'border-transparent'
                  }`}
                  onClick={() => handleOnClickToAddSubject(subject.id)}
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-black">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-black/60">{subject.code}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Separator />
            <Button
              className="bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
              onClick={handleOnClickToSaveSubjects}
            >
              Save and Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SubjectSelection
