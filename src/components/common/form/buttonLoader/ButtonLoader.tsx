interface ButtonLoaderProps {
  title: string
}
const ButtonLoader = ({ title }: ButtonLoaderProps) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-black"></div>
      <span>{title}</span>
    </div>
  )
}

export default ButtonLoader
