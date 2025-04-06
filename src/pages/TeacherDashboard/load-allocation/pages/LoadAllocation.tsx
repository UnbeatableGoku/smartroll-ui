import SubjectAllocationDetails from "../components/SubjectAllocationDetails"
import useLoadAllocation from "../hooks/useLoadAllocation"

const LoadAllocation = () => {
    const {AllocationData} = useLoadAllocation()
  return (
    <div className="mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Assigned Subjects</h1>
        { AllocationData && <SubjectAllocationDetails Allocationdata={AllocationData}/>}
    </div>
  )
}

export default LoadAllocation