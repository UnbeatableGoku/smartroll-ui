import SubjectAllocationDetails from '../components/SubjectAllocationDetails'
import useLoadAllocation from '../hooks/useLoadAllocation'

const LoadAllocation = () => {
  const { AllocationData } = useLoadAllocation()
  return (
    <div className="mx-auto p-4">
      <h1 className="mb-6 text-center text-3xl font-bold text-black">
        Assigned Subjects
      </h1>
      {AllocationData && (
        <SubjectAllocationDetails Allocationdata={AllocationData} />
      )}
    </div>
  )
}

export default LoadAllocation
