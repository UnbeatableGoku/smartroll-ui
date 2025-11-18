import { RootState } from '@data/Store'
import { hideAdverticement } from '@data/slices/adverticementBarSlice'
import { IoCloseCircle } from 'react-icons/io5'
import { RiAlarmWarningFill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

const AdverticementBar = () => {
  const state = useSelector((root: RootState) => root.barSlice)
  const dispatch = useDispatch()
  const closeBar = () => {
    dispatch(hideAdverticement())
  }

  if (!state.display) return null

  return (
    <div className="duration-[2000ms] flex min-h-10 w-full items-center justify-between bg-[#f9df00] p-1">
      <div className="flex w-full items-center space-x-2 pl-3 md:justify-center">
        <div className="text-red-700">
          <RiAlarmWarningFill size={22} />
        </div>
        <div className="flex flex-col pt-1 md:flex-row">
          <span className="text-base font-semibold text-black md:text-sm">
            {state.title}:
          </span>
          <span className="ml-0 text-xs text-black md:ml-1 md:text-sm">
            {state.message}
          </span>
        </div>
      </div>
      <div className="cursor-pointer pr-3 text-black">
        <IoCloseCircle size={22} onClick={closeBar} />
      </div>
    </div>
  )
}

export default AdverticementBar
