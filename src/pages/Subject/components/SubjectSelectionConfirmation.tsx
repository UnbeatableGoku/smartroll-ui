import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useSubjectStore } from '@/store/subjectStore'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const SubjectSelectionConfirmation = () => {
  const navigate = useNavigate()
  const { subjects, selectedSubjects, confirmSubjectSelection } =
    useSubjectStore()

  const handleOnClickToConfirmSubjects = () => {
    if (selectedSubjects.length === 0) {
      toast.error('Please select subjects first')
      navigate('/subject/selection')
      return
    }

    confirmSubjectSelection()
    toast.success('Subject selection confirmed successfully')
    navigate('/subject')
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
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-black">
              Confirm Subject Selection
            </h1>
            <p className="text-black/60">
              Review and confirm your subject selection
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <Card className="bg-[#F7F7F7] p-6 shadow-soft">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjects
                .filter((subject) => selectedSubjects.includes(subject.id))
                .map((subject) => (
                  <Card key={subject.id} className="bg-white p-4 shadow-soft">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-[#0261BE]/10 p-1">
                        <Check className="h-4 w-4 text-[#0261BE]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold text-black">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-black/60">{subject.code}</p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
            <Separator />
            <Button
              className="bg-[#0261BE] text-white hover:bg-[#0261BE]/80"
              onClick={handleOnClickToConfirmSubjects}
            >
              Confirm Selection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SubjectSelectionConfirmation
