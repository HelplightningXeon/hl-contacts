import React from 'react'
import PropTypes from 'prop-types'
import {
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap'

class ServerSearch extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      timeout: null
    }
  }

  onChange = (e) => {
    const val = e.target.value
    this.setState(state => {
      if (state.timeout) {
        clearTimeout(state.timeout)
      }
      const timeout = setTimeout(() => {
        this.props.onChange(val)
      }, 250)
      return { timeout }
    })
  }

  render = () => (
    <FormGroup className="filter-text-box">
      <ControlLabel>{'Search'}</ControlLabel>
      <FormControl
        type="text"
        id="filter-text-box"
        onChange={this.onChange}
        placeholder=""
        autoFocus
      />
    </FormGroup>
  )
}

export default ServerSearch
