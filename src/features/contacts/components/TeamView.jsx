import PaginationCache from '../helpers/PaginationCache'
import MultiPaginationCache from '../helpers/MultiPaginationCache'
import './TeamView.scss'
import BaseContactsView from './BaseContactsView'

class TeamView extends BaseContactsView {
  constructor (props) {
    super(props)
    this.state = {
      filter: '',
      caches: this.buildCaches()
    }
    this.viewName = 'TeamView'
  }

  buildCaches = () => {
    return new MultiPaginationCache([
      new PaginationCache(20, (page, pageSize) => this.fetchData('/user/search/on_call_groups', page, pageSize)),
      new PaginationCache(20, (page, pageSize) => this.fetchData('/user/search/team', page, pageSize))
    ])
  }
}

export default TeamView
