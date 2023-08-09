import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  AgGridHeader,
  AgGridContent,
  ServerSearch,
  PaginationGrid
} from './AgGridWrapper'
import { galdrClient, galdrClientV1R1 } from '../../../api'
import MultiPaginationCache from '../helpers/MultiPaginationCache'
import { getDefaultAvatar } from '../helpers/account'
import './TeamView.scss'

class BaseContactsView extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    callContact: PropTypes.func.isRequired,
    chatContact: PropTypes.func,
    callGroup: PropTypes.func.isRequired,
    enterpriseContactVersion: PropTypes.number,
    showModal: PropTypes.func.isRequired,
    sendOTUInvitation: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      filter: '',
      caches: this.buildCaches()
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.needRefreshData(nextProps)) {
      this.refreshData()
    }
  }

  needRefreshData = (nextProps) => {
    const { currentUser: { currentWorkspaceId } } = this.props
    const nextWorkspaceId = nextProps.currentUser.currentWorkspaceId
    return (
      nextProps.enterpriseContactVersion !== this.props.enterpriseContactVersion ||
      currentWorkspaceId !== nextWorkspaceId
    )
  }

  buildCaches = () => {
    return new MultiPaginationCache([])
  }

  requestV1R1 = (method, url, params) => {
    const { currentUser } = this.props
    return galdrClientV1R1.request({ method, url, headers: { 'Authorization': currentUser.token }, params: params })
  }

  request = (method, url, params) => {
    const { currentUser } = this.props
    return galdrClient.request({ method, url, headers: { 'Authorization': currentUser.token }, params: params })
  }

  fetchData = (endpoint, page, pageSize) => {
    const params = { page, page_size: pageSize, search_term: this.state.filter }
    return this.requestV1R1('get', endpoint, params)
  }

  onCallClick = (data) => {
    const dialer = this.props.currentUser
    if (data.isGroup || data.on_call_group) {
      this.props.callGroup({
        groupId: data.id,
        groupName: data.name,
        enterpriseId: data.enterprise_id || this.props.currentUser.enterprise_id,
        audioOnly: data.audioOnly
      }, dialer)
    } else if (!data.reachable) {
      this.props.showModal({ modalType: 'CALL_UNREACHABLE_USER_MODAL', modalProps: { contact: data, onSendClick: this.props.sendOTUInvitation, token: this.props.currentUser.token } })
    } else {
      this.props.callContact(data, dialer)
    }
  }

  onChatClick = (data) => {
    this.props.chatContact(data)
  }

  changeFavorite = (e, id, state, data) => {
    e.stopPropagation()
    if (data.isGroup || data.on_call_group) {
      this.request(state ? 'post' : 'delete', `/on_call_groups/${id}/favorites`, {})
        .then((resp) => {
          const node = this.state.gridApi.getRowNode(id)
          if (node) {
            node.setData({ ...data, favorite: !data.favorite })
          }
        })
    } else {
      this.request(state ? 'post' : 'delete', '/favorites', { id })
        .then((resp) => {
          const node = this.state.gridApi.getRowNode(id)
          if (node) {
            node.setData({ ...data, favorite: !data.favorite })
          }
        })
    }
  }

  onGridReady = (params) => {
    this.setState({ gridApi: params.api })
  }

  onSearch = (value) => {
    this.setState({ filter: value, caches: this.buildCaches() })
    if (this.state.gridApi) {
      this.state.gridApi.purgeInfiniteCache()
    }
  }

  refreshData = () => {
    this.setState({ caches: this.buildCaches() }, () => {
      if (this.state.gridApi) {
        this.state.gridApi.purgeInfiniteCache()
      }
    })
  }

  rowClass (params) {
    const classes = []
    if (params.data) {
      const onCallGroup = params.data.isGroup || params.data.on_call_group
      if (onCallGroup) {
        classes.push('onCallGroupRow')
      } else if (!params.data.reachable) {
        classes.push('unreachableRow')
      }
      classes.push('paginationGridRow')
      if (params.data.license === 'device') {
        classes.push('device-license')
      }
      if (!params.data.supports_messaging) {
        classes.push('can-not-message')
      }
      return classes.join(' ')
    }
  }

  render () {
    const { t, currentUser } = this.props
    const columns = [
      { key: 'avatar', label: t('Avatar') },
      { key: 'nameDetails', label: t('Name'), showIfNotSignIn: true },
      { key: 'makeCall', label: t('Call') },
      { key: 'favorite', label: t('Favorite') }
    ]
    const context = { componentParent: this }
    return (
      <div className={`${this.viewName}`}>
        <AgGridHeader>
          <ServerSearch onChange={this.onSearch} />
        </AgGridHeader>
        <AgGridContent>
          { this.state.caches
            ? <PaginationGrid
              cache={this.state.caches}
              columns={columns}
              id={`hlGrid${this.viewName}`}
              getRowClass={this.rowClass}
              context={context}
              onGridReady={this.onGridReady}
              autoHideColumns={false}
              showHeaders={false}
              t={t}
              parentClassName={this.viewName}
              customColumns={{ avatar: { cellRendererParams: { defaultAvatar: getDefaultAvatar(currentUser) } } }}
            />
            : <i className="fa fa-spinner fa-pulse fa-fw fa-3x" />
          }
        </AgGridContent>
      </div>
    )
  }
}

export default BaseContactsView
