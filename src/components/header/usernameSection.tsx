const UserNameSection = () => {
  const user = {
    firstName: 'Prathmesh',
    lastName: 'pandya',
  }

  if (!user) {
    return <></>
  }

  const name = `${user?.firstName} ${user?.lastName}`
  const logoText = `${user?.firstName?.[0]}${user?.lastName?.[0]}`.toUpperCase()

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sm font-bold leading-tight tracking-wider text-white">
        {logoText}
      </div>
      <div className="font-bold capitalize">{name}</div>
    </div>
  )
}

export default UserNameSection
