import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { GetColumn, FrameworkComponents } from './Columns'
import { isTouchScreenDevice } from './device'

class PaginationGrid extends Component {
  static propTypes = {
    cache: PropTypes.object,
    context: PropTypes.object,
    columns: PropTypes.array,
    onGridReady: PropTypes.func,
    callContact: PropTypes.func,
    changeFavorite: PropTypes.func,
    getRowClass: PropTypes.func,
    id: PropTypes.string,
    t: PropTypes.func.isRequired,
    showHeaders: PropTypes.bool,
    autoHideColumns: PropTypes.bool,
    customColumns: PropTypes.object,
    parentClassName: PropTypes.string
  }

  static defaultProps = {
    showHeaders: true,
    autoHideColumns: true
  }

  constructor (props) {
    super(props)
    this.state = {
      gridApi: null,
      rowBuffer: 0,
      rowModelType: 'infinite',
      cacheOverflowSize: 2,
      infiniteInitialRowCount: 1,
      maxBlocksInCache: 100,
      cacheBlockSize: 20,
      blockLoadDebounceMillis: 500,
      error: false,
      errorMessage: '',
      shiftRowsIndex: null
    }
  }

  componentDidUpdate () {
    this.state.gridApi && this.state.gridApi.sizeColumnsToFit()
  }

  getRows = (params) => {
    if (!this.props.cache) {
      return []
    }
    this.props.cache.fetchData(params.startRow, params.endRow)
      .then((entries) => {
        params.successCallback(entries, this.props.cache.total)
        setTimeout(() => this.state.gridApi.sizeColumnsToFit(), 200)
        return entries
      }).catch((err) => {
        console.log('getRows error')
        console.log(err)
        this.setState({
          error: true,
          errorMessage: 'Could not retrieve data, try refreshing page'
        })
        params.failCallback()
      })
  }

  onGridReady = (params) => {
    this.setState({ gridApi: params.api })
    params.api.setDatasource({ getRows: this.getRows })
    this.props.onGridReady(params)
  }

  onGridSizeChanged = (params) => {
    const autoHideColumns = this.props.autoHideColumns
    const gridWidth = document.getElementById('grid-wrapper').offsetWidth
    const columnsToShow = []
    const columnsToHide = []
    let totalColsWidth = 0
    const allColumns = params.columnApi.getAllColumns()
    for (let i = 0; i < allColumns.length; i++) {
      const column = allColumns[i]
      totalColsWidth += column.getMinWidth()
      if (totalColsWidth > gridWidth && autoHideColumns) {
        columnsToHide.push(column.colId)
      } else {
        columnsToShow.push(column.colId)
      }
    }
    params.columnApi.setColumnsVisible(columnsToShow, true)
    params.columnApi.setColumnsVisible(columnsToHide, false)
    params.api.sizeColumnsToFit()
  }

  getRowStyle = ({ node }) => {
    if (this.state.shiftRowsIndex !== null && node.rowIndex > this.state.shiftRowsIndex) {
      return (
        { transform: `translateY(${(node.rowIndex + 1) * 48}px) !important` }
      )
    } else if (this.state.shiftRowsIndex !== null && node.rowIndex === this.state.shiftRowsIndex) {
      return { borderBottom: '1px solid #e2e2e2 !important' }
    }
  }

  render () {
    const { getRowClass, context, columns, showHeaders, t, customColumns } = this.props
    const noSort = (col) => {
      return { ...col, sortable: false }
    }
    const columnDefs = columns.map(e => noSort(GetColumn(e, t, customColumns)))

    const frameworkComponents = { ...FrameworkComponents }
    const extras = {}
    if (!showHeaders) {
      extras.headerHeight = '0px'
    }
    if (this.state.error) {
      return (
        <div className="alert alert-danger" role="alert">
          <p>{t(this.state.errorMessage)}</p>
        </div>
      )
    }
    return (
      <AgGridReact
        id={this.props.id || 'hlGrid'}
        columnDefs={columnDefs}
        defaultColDefs={{ resizable: true }}
        colResizeDefault="shift"
        getRowClass={getRowClass}
        context={context}
        frameworkComponents={frameworkComponents}
        onGridReady={this.onGridReady}
        onGridSizeChanged={this.onGridSizeChanged}
        suppressRowHoverHighlight
        suppressScrollOnNewData
        components={this.state.components}
        rowBuffer={this.state.rowBuffer}
        rowModelType={this.state.rowModelType}
        cacheOverflowSize={this.state.cacheOverflowSize}
        infiniteInitialRowCount={this.state.infiniteInitialRowCount}
        maxBlocksInCache={this.state.maxBlocksInCache}
        cacheBlockSize={this.state.cacheBlockSize}
        getRowNodeId={(data) => data.id}
        deltaRowDataMode
        blockLoadDebounceMillis={this.state.blockLoadDebounceMillis}
        {...extras}
        getRowStyle={this.getRowStyle}
        rowSelection="single"
        suppressRowClickSelection={!isTouchScreenDevice()}
      />
    )
  }
}

export default PaginationGrid
