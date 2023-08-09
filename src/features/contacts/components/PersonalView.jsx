import PropTypes from 'prop-types'
import PaginationCache from '../helpers/PaginationCache'
import './PersonalView.scss'
import BaseContactsView from './BaseContactsView'

class PersonalView extends BaseContactsView {
  static propTypes = {
    currentUser: PropTypes.object,
    contactVersion: PropTypes.number.isRequired,
    changedContact: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      cache: this.buildCache()
    }
    this.viewName = 'PersonalView'
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { currentUser: { currentWorkspaceId } } = this.props
    const nextWorkspaceId = nextProps.currentUser.currentWorkspaceId
    if (nextProps.contactVersion !== this.props.contactVersion) {
      this.applySingleChange(nextProps.changedContact)
    }
    if (currentWorkspaceId !== nextWorkspaceId) {
      this.refreshData()
    }
  }

  buildCache = () => {
    return new PaginationCache(20, (page, pageSize) => this.fetchData('/user/search/personal', page, pageSize))
  }

  applySingleChange = (changedContact) => {
    const contact = changedContact.contact
    const node = this.state.gridApi.getRowNode(contact.id)
    if (node) {
      node.setData(contact)
    }
  }
}

export default PersonalView
