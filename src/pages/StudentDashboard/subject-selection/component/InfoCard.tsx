const InfoCard = ({
  theory_exam_duration,
  practical_exam_duration,
  subject_code,
}: any) => {
  return (
    <div className="space-y-1 rounded-lg bg-[#F7F7F7] p-4 shadow-soft">
      <h4 className="text-sm font-semibold text-black">Course Information</h4>
      <p className="text-sm text-black">
        Theory Exam Duration: {theory_exam_duration}h
      </p>
      <p className="text-sm text-black">
        Practical Exam Duration: {practical_exam_duration}h
      </p>
      <div className="flex items-center pt-2">
        <span className="text-xs text-black/60">
          For more Info. -{' '}
          <a
            href={`https://s3-ap-southeast-1.amazonaws.com/gtusitecirculars/Syallbus/${subject_code}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0261BE] underline hover:text-[#0261BE]/80"
          >
            GTU Syllabus
          </a>
        </span>
      </div>
    </div>
  )
}

export default InfoCard
