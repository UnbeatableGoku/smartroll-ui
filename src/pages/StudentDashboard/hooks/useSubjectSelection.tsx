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
  categorySelections?: Record<string, boolean>
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
    // Update selected subjects
    setSelectedSubjects((prev: SelectedSubjects): SelectedSubjects => {
      // Filter out previously selected subject in the same category
      const filteredChoices = prev.subject_choices.filter(
        (choice) =>
          !prev.subject_details.find(
            (detail) => detail.category === category && detail.slug === choice,
          ),
      )

      // Filter out previously selected subject details from this category
      const filteredDetails = prev.subject_details.filter(
        (detail) => detail.category !== category,
      )

      return {
        subject_choices: [...filteredChoices, slug], // Add new subject slug to choices
        subject_details: [
          ...filteredDetails, // Add new subject details to subject_details
          { slug, subject_name, subject_code, category },
        ],
        subject_choice_slug: subjectSlug,
      }
    })

    // Update category selection state
    setCategorySelections((prev) => ({
      ...prev,
      [category]: slug, // Store the selected subject slug for the category
    }))
  }

  return {
    handleSubjectSelection,
    selectedSubjects,
    categorySelections,
  }
}

export default useSubjectSelection
