import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X} from 'lucide-react'

const ConfirmSubjectSelection = ({isPanelOpen,setIsPanelOpen,togglePanel,subjects}:any) => {
    
     

      
  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100">
    

    {/* Overlay */}
    {isPanelOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-20"
        onClick={togglePanel}
      />
    )}

    {/* Sliding Panel */}
    <div
      className={`fixed top-0 right-0 h-full border rounded-md w-full md:w-[30%] bg-black shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-100">Selected Subjects</h2>
          <Button variant="ghost" size="icon" onClick={togglePanel}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="space-y-4">
          {subjects.map((subject:any) => (
            <Card key={subject.slug} className="bg-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-100">
                  {subject?.subject_name}  ({subject?.subject_code})
                </CardTitle>
              </CardHeader>
              <CardContent>
                
              </CardContent>
            </Card>
          ))}
          <Button>Save</Button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ConfirmSubjectSelection