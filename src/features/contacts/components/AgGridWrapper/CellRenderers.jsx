import PropTypes from 'prop-types'
import React from 'react'
import missing from '../../../../avatar.png'
import { isUserDevice } from './device'
import './CellRenderers.scss'

export const CallSubmenuButtonRenderer = (x) => {
  const { node, data, context: { componentParent } } = x
  const { sendOTUInvitation, currentUser } = componentParent.props

  const handleInviteClick = (e) => {
    e.stopPropagation()
    sendOTUInvitation(data.id, currentUser.token)
  }

  const handleVideoClick = (e) => {
    e.stopPropagation()
    componentParent.onCallClick(data)
  }

  const handleAudioClick = (e) => {
    e.stopPropagation()
    componentParent.onCallClick({ ...data, audioOnly: true })
  }

  const handleMessageClick = (e) => {
    e.stopPropagation()
    componentParent.onChatClick(data)
  }

  if (!node) { return null }

  return (
    <div className="buttons-container">
      <div className="ellipsis-menu-div">
        <i className="fa fa-ellipsis-v fa-lg"></i>
      </div>
      <div className="buttons-stripe">
        <div className="button btn-video" onClick={handleVideoClick}>
          <i className="fa fa-video" />
          <span className="icon-label">{'Video'}</span>
        </div>
        <div className="button btn-audioplus" onClick={handleAudioClick}>
          <span className="audioPlusIcon"></span>
          <span className="icon-label audio-plus">{'audio_plus_out_of_call'}</span>
        </div>
          <div className="button message" onClick={handleMessageClick}>
            <i class="fa fa-comment-dots"></i>
            <span className="icon-label">{'Message'}</span>
          </div>
        <div className="button invite-btn-container" onClick={handleInviteClick}>
            <i class="fa-solid fa-envelope"></i>
          <span className="icon-label">{'Invite'}</span>
        </div>
      </div>
    </div>
  )
}
CallSubmenuButtonRenderer.propTypes = {
  node: PropTypes.object,
  data: PropTypes.object,
  context: PropTypes.object
}

export const HlFavoriteIconRenderer = (props) => {
  if (!props.data) { return null }
  const iconClass = props.value ? 'fa fa-star favoriteIcon star-on' : 'fa fa-star favoriteIcon star-off'
  return (
    <div
      onClick={(e) => (
        props.context.componentParent.changeFavorite(e, props.data.id, !props.value, props.data)
      )}
      className="favorite-div"
    >
      <i className={iconClass} />
    </div>
  )
}
HlFavoriteIconRenderer.propTypes = {
  value: PropTypes.bool,
  data: PropTypes.object,
  context: PropTypes.object
}

export const AvatarImageRenderer = (props) => {
  const { data, defaultAvatar } = props
  const altText = data?.name || 'Avatar'
  if (!data) {
    return (
      <div style={{ fontSize: '40px' }}>
        <i className="fa fa-spinner fa-pulse fa-fw" />
      </div>
    )
  }
  const color = data.color
  let style = {
    width: '40px',
    height: '40px',
    color,
    fontSize: '45px'
  }
  // default for users table
  const isDevice = isUserDevice(data)
  let avatarHtml = <img src={defaultAvatar || missing} alt={altText} style={{ width: '40px', borderRadius: '50%' }} />
  if (isDevice) {
    avatarHtml = <i className="far fa-head-vr device" />
  }
  // format default differently for groups/personas
  if ('user_count' in data) {
    avatarHtml = <i className="fa fa-circle" style={{ ...style }} />
  }
  const url = data.avatar.url || data.avatar.thumb
  if (url) {
    style = {
      ...style,
      border: `4px solid ${color}`,
      borderRadius: '50px'
    }
    // although, don't apply border if there is no color prop
    // colored borders should apply only to personas
    if (!data.color) {
      delete style.border
    }
    avatarHtml = <img src={url} style={{ ...style }} alt={altText} />
  }

  if (data.on_call_group || data.isGroup) {
    const bottom = '5px'
    const right = '20px'
    const groupHtml = (
      <span className="icomooni-icon-expert-group4" style={{ align: 'right', verticalAlign: 'bottom', right: right, bottom: bottom, position: 'relative', fontSize: '18px' }}>
        <span className="path1" />
        <span className="path2" />
        <span className="path3" />
        <span className="path4" />
      </span>
    )
    avatarHtml = <div>{avatarHtml} {groupHtml}</div>
  }

  return <div className="AvatarImageRenderer">{avatarHtml}</div>
}
AvatarImageRenderer.propTypes = {
  data: PropTypes.object,
  defaultAvatar: PropTypes.string
}

export function NameDetailsRenderer ({ data, colDef }) {
  if (data && data.on_call_group) {
    return GroupNameDetails(data)
  } else {
    return NameDetails(data, colDef.showIfNotSignIn)
  }
}
NameDetailsRenderer.propTypes = {
  data: PropTypes.object
}

function NameDetails (data, showIfNotSignIn) {
  if (data) {
    const name = (data.reachable || !showIfNotSignIn) ? data.name : `${data.name} ('not_signed_in')`
    return (
      <div className="card">
        <div className="cardName" title={data.name}>{name}</div>
        { (nonEmptyString(data.title) || nonEmptyString(data.location)) && (
          <>
            <div className="text-muted cardSub" title={data.title}>{data.title}</div>
            <div className="text-muted cardSub" title={data.location}>{data.location}</div>
          </>
        )}
      </div>
    )
  } else {
    return null
  }
}
NameDetails.propTypes = {
  data: PropTypes.object
}

function GroupNameDetails (data, rowMenuClosed, componentParent) {
  if (data) {
    return (
      <div className="group-card">
        <div className="cardName" title={data.name}>{data.name}</div>
        <div className="text-muted cardSub" title={data.description}>{data.description}</div>
      </div>
    )
  } else {
    return null
  }
}
GroupNameDetails.propTypes = {
  data: PropTypes.object
}

function nonEmptyString (str) {
  return str && str.length > 0
}
