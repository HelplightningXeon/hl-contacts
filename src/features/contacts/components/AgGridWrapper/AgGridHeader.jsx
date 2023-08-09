import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './AgGridWrapper.scss'

export default class AgGridHeader extends Component {
  static propTypes = {
    children: PropTypes.any
  }

  render () {
    return (
      <div className="AgGridWrapper">
        <div className="row table-control-row">
          {this.props.children}
        </div>
      </div>
    )
  }
}
