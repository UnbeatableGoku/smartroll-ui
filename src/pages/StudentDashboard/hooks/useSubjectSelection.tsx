import { useState } from 'react'

interface CategorySelections {
  [key: string]: string
}

interface SubjectDetail {
  slug: string
  subject_name: string
  subject_code: string
  category: string
}

interface SelectedSubjects {
  subject_choices: string[]
  subject_details: SubjectDetail[]
  subject_choice_slug?: string
}
const useSubjectSelection = () => {
  const [categorySelections, setCategorySelections] =
    useState<CategorySelections>({})

  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubjects>({
    subject_choices: [],
    subject_details: [],
  })

  const handleSubjectSelection = (
    category: string,
    slug: string,
    subject_name: string,
    subject_code: string,
    subjectSlug: string,
  ) => {
    setCategorySelections((prev) => ({
      ...prev,
      [category]: slug,
    }))

    setSelectedSubjects((prev: SelectedSubjects): SelectedSubjects => {
      // Added explicit typing
      const filteredChoices = prev.subject_choices.filter(
        (choice) =>
          !prev.subject_details.find(
            (detail) => detail.category === category && detail.slug === choice,
          ),
      )

      const filteredDetails = prev.subject_details.filter(
        (detail) => detail.category !== category,
      )

      return {
        subject_choices: [...filteredChoices, slug],
        subject_details: [
          ...filteredDetails,
          { slug, subject_name, subject_code, category },
        ],
        subject_choice_slug: subjectSlug,
      }
    })
  }
  return { handleSubjectSelection, selectedSubjects, categorySelections }
}

export default useSubjectSelection
