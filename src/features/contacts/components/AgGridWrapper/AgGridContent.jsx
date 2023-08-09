import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './AgGridWrapper.scss'

export default class AgGridContent extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  }

  render () {
    return (
      <div className="AgGridWrapper">
        <div className="row">
          <div className="col col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div id="grid-wrapper" className="grid-wrapper">
              <div className="inner ag-theme-material ag-theme-override">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
