export const isUserDevice = (user) => {
  return (
    user && user.license === 'device'
  )
}

export const isTouchScreenDevice = () => {
  return window.matchMedia('(pointer: coarse)').matches
}
