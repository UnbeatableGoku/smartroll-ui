const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Work':
      return 'bg-blue-400 text-blue-900'
    case 'Personal':
      return 'bg-green-400 text-green-900'
    case 'Health':
      return 'bg-red-400 text-red-900'
    default:
      return 'bg-yellow-400 text-yellow-900'
  }
}

export { getCategoryColor }
