interface Prop {
  children: JSX.Element
}

const FormLayout = ({ children }: Prop) => {
  return (
    <div className="w-full rounded-md border-2 bg-white p-6">{children}</div>
  )
}

export default FormLayout
