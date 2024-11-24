const InfoCard = ({
  theory_exam_duration,
  practical_exam_duration,
  subject_code,
}: any) => {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-semibold">Course Information</h4>
      <p className="text-sm">Theory Exam Duration: {theory_exam_duration}h</p>
      <p className="text-sm">
        Practical Exam Duration: {practical_exam_duration}h
      </p>
      <div className="flex items-center pt-2">
        <span className="text-xs text-muted-foreground">
          For more Info. -{' '}
          <a
            href={`https://s3-ap-southeast-1.amazonaws.com/gtusitecirculars/Syallbus/${subject_code}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            GTU Syllabus
          </a>
        </span>
      </div>
    </div>
  )
}

export default InfoCard
