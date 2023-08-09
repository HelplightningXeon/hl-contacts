import {
  CallSubmenuButtonRenderer,
  AvatarImageRenderer,
  HlFavoriteIconRenderer,
  NameDetailsRenderer
} from './CellRenderers.jsx'

const GetColumn = (col, t, customColumns) => {
  let colConfig
  switch (col.key) {
    case 'avatar':
      colConfig = {
        field: 'avatar',
        headerName: '',
        suppressMenu: true,
        filter: false,
        cellRenderer: 'avatarImageRenderer',
        cellClass: (p) => (p.data && !p.data.reachable ? 'unreachableAvatar' : ''),
        minWidth: 70,
        width: 70,
        suppressSizeToFit: true,
        sortable: false
      }
      return (customColumns && customColumns.avatar) ? { ...colConfig, ...customColumns.avatar } : colConfig
    case 'makeCall':
      return {
        headerName: '',
        cellRenderer: 'callSubmenuButtonRenderer',
        cellClass: (p) => (p.data && !p.data.reachable ? 'unreachable' : ''),
        suppressMenu: true,
        filter: false,
        suppressSizeToFit: true,
        minWidth: 290,
        maxWidth: 290,
        width: 290,
        sortable: false
      }
    case 'favorite':
      return {
        field: 'favorite',
        headerName: col.label,
        cellRenderer: 'hlFavoriteIconRenderer',
        minWidth: 120,
        maxWidth: 120,
        width: 120,
        resizable: false,
        sortable: false
      }
    case 'nameDetails':
      return {
        field: 'name',
        tooltipField: col.key,
        headerName: col.label,
        autoHeight: true,
        suppressMenu: true,
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        cellRenderer: 'nameDetailsRenderer',
        showIfNotSignIn: col.showIfNotSignIn,
        cellClass: (p) => (`${p.data && !p.data.reachable ? 'unreachableText' : ''} nameDetailsCell`)
      }
    default:
      return {
        field: col.key,
        tooltipField: col.key,
        headerName: col.label,
        suppressMenu: true,
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter'
      }
  }
}

const FrameworkComponents = {
  callSubmenuButtonRenderer: CallSubmenuButtonRenderer,
  avatarImageRenderer: AvatarImageRenderer,
  hlFavoriteIconRenderer: HlFavoriteIconRenderer,
  nameDetailsRenderer: NameDetailsRenderer
}

export { GetColumn, FrameworkComponents }
