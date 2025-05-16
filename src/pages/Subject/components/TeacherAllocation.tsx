import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useSubjectStore } from '@/store/subjectStore'
import { useTeacherStore } from '@/store/teacherStore'
import { ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import TeacherToSubjectMapPanel from './TeacherToSubjectMapPanel'

const TeacherAllocation = () => {
  const navigate = useNavigate()
  const { subjects } = useSubjectStore()
  const { teachers } = useTeacherStore()
  const [teacherSubjectMap, setTeacherSubjectMap] = useState<any>({})

  useEffect(() => {
    if (subjects.length === 0) {
      toast.error('Please add subjects first')
      navigate('/subject')
    }
  }, [subjects])

  return (
    <div className="min-h-screen w-full bg-white px-4 py-6">
      <Helmet>
        <title>Teacher Allocation</title>
      </Helmet>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-[#0261BE] hover:bg-[#0261BE]/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-black">
              Teacher Allocation
            </h1>
            <p className="text-black/60">
              Allocate teachers to subjects for better management
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <Card className="bg-[#F7F7F7] p-6 shadow-soft">
          <TeacherToSubjectMapPanel
            subjects={subjects}
            teachers={teachers}
            teacherSubjectMap={teacherSubjectMap}
            setTeacherSubjectMap={setTeacherSubjectMap}
          />
        </Card>
      </div>
    </div>
  )
}

export default TeacherAllocation
