import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Tabs, Tab, Button } from 'react-bootstrap'
import iconInvite from '../icon-invite.svg'
import TeamView from './TeamView'
import FavoritesView from './FavoritesView'
import DirectoryView from './DirectoryView'
import PersonalView from './PersonalView'
import './Contacts.scss'

class ContactsView extends Component {
  static propTypes = {
    activeKey: PropTypes.string,
    currentUser: PropTypes.object,
    showPersonal: PropTypes.bool,
    showDirectory: PropTypes.bool,
    onInviteUserClick: PropTypes.func,
    callContact: PropTypes.func.isRequired,
    callGroup: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    router: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.state = {
      key: props.activeKey || 'team'
    }
  }

  renderMyHelpSpaceLink = () => {
    if (this.props.onInviteUserClick) {
      return (
        <Button primary imageUrl={iconInvite} onClick={this.props.onInviteUserClick}>
          {this.props.t('Send My Help Space Invitation')}
        </Button>
      )
    }
  }

  handleSelect = (key) => {
    this.setState({ key })
    const { router } = this.props
    router?.push(`/contacts/${key}`)
  }

  renderDicTab () {
    const { t, showDirectory } = this.props
    return showDirectory && (
      <Tab eventKey={'directory'} title={<div><i className="fa fa-address-book" /> <span>{t('Directory')}</span></div>}>
        <DirectoryView {...this.props} />
      </Tab>
    )
  }

  renderPersonalTab () {
    const { t, showPersonal } = this.props
    return showPersonal && (
      <Tab eventKey={'personal'} title={<div><i className="fa fa-users-class" /> <span>{t('Personal')}</span></div>}>
        <PersonalView {...this.props} />
      </Tab>
    )
  }

  renderTeamTab () {
    const { t } = this.props
    return <Tab eventKey={'team'} title={<div><i className="fa fa-users" /> <span>{t('Team')}</span></div>}>
      <TeamView {...this.props} />
    </Tab>
  }

  renderFavTab () {
    const { t } = this.props
    return <Tab eventKey={'favorites'} title={<div><i className="fa fa-star" /> <span>{t('Favorites')}</span></div>}>
      <FavoritesView {...this.props} />
    </Tab>
  }

  render () {
    const { currentUser, t } = this.props
    if (currentUser.token) {
      return (
        <div className="Contacts">
          <h1>{t('Contacts')} {this.renderMyHelpSpaceLink()}</h1>
          <Tabs
            id="user-tabs"
            activeKey={this.state.key}
            onSelect={this.handleSelect}
            className="container-box"
          >
            {this.renderFavTab()}
            {this.renderTeamTab()}
            {this.renderPersonalTab()}
            { this.renderDicTab()}
          </Tabs>
        </div>
      )
    }
    return null
  }
}

export default ContactsView
