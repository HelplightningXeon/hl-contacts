import missing from '../../../avatar.png'

export function getDefaultAvatar (currentUser) {
  if (currentUser?.userBranding?.enabled) {
    return currentUser.userBranding.default_avatar_url
  }
  return missing
}