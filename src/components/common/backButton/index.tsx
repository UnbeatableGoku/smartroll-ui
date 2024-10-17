import { MouseEventHandler } from 'react'

import Button from '../form/button'
import { ChevronIcon } from '@icons'
import { useNavigate } from 'react-router-dom'

type Props = {
  handleBack?: MouseEventHandler<HTMLButtonElement>
}

const BackButton = ({ handleBack }: Props) => {
  const navigate = useNavigate()
  const handleDefaultback = () => {
    navigate(-1)
  }
  return (
    <Button
      variant="outline"
      label="back"
      className="mb-4 px-4 font-normal"
      startIcon={<ChevronIcon />}
      startIconClass="!h-3 !w-3 rotate-90"
      onClick={handleBack ?? handleDefaultback}
    />
  )
}

export default BackButton
