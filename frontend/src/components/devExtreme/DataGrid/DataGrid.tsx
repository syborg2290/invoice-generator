import DataGrid, {
  Toolbar,
  Item,
  Editing,
  StateStoring,
} from 'devextreme-react/data-grid'
import { useResizeDetector } from 'react-resize-detector'
import { useRef } from 'react'
import dxDataGrid, { dxDataGridOptions } from 'devextreme/ui/data_grid'
import _ from 'lodash'

import dxService from '../dxService'

import {
  IDataGridEventOnInitialized,
  IDataGridEventOnOptionChanged,
  IDataGridEventOnRowRemoved,
  IDataGridEventOnSaved,
  IDataGridEventOnSelectionChanged,
  IDataGridOptions,
  IDataGridToolbarItem,
} from './DataGrid.interface'
import { IOptions } from '../../components.interface'

import { Enums } from '../../../constants/enums'

import resizeDetector from '../resizeDetector.module.css'

const defaultKeyExpr: string = 'key'

const DataGridWrapper = (props: IOptions<IDataGridOptions>): JSX.Element => {
  const { width, height, ref } = useResizeDetector<HTMLDivElement>()
  const gridComponent = useRef<dxDataGrid>()

  const onInitialized = async (
    e: IDataGridEventOnInitialized
  ): Promise<void> => {
    gridComponent.current = e.component
    dxService.callFromProps(props, 'onInitialized', e)
  }

  const getCustomItems = (): JSX.Element[] => {
    return _.map(
      props.options.toolbar?.customElements,
      (itemOptions: IDataGridToolbarItem, index: number): JSX.Element => {
        return <Item key={index} {...itemOptions} />
      }
    )
  }

  const getOptionsExceptParams = (): dxDataGridOptions => {
    const options = _.omit(props.options, [
      'editing',
      'toolbar',
      'stateStoring',
    ])

    return options
  }

  return (
    <div className={resizeDetector.box} ref={ref}>
      <DataGrid
        {...getOptionsExceptParams()}
        width={width}
        height={height}
        showBorders={true}
        keyExpr={props.options.keyExpr ?? defaultKeyExpr}
        allowColumnResizing={true}
        allowColumnReordering={true}
        onInitialized={onInitialized}
        onSelectionChanged={(e: IDataGridEventOnSelectionChanged) =>
          dxService.callFromProps(props, 'onSelectionChanged', e)
        }
        onSaved={(e: IDataGridEventOnSaved) =>
          dxService.callFromProps(props, 'onSaved', e)
        }
        onRowRemoved={(e: IDataGridEventOnRowRemoved) =>
          dxService.callFromProps(props, 'onRowRemoved', e)
        }
        onOptionChanged={(e: IDataGridEventOnOptionChanged) =>
          dxService.callFromProps(props, 'onOptionChanged', e)
        }
      >
        <Toolbar>
          {getCustomItems()}
          <Item name={'addRowButton'} showText={'always'} />
        </Toolbar>
        <Editing
          mode={'form'}
          useIcons={true}
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={true}
          confirmDelete={false}
          newRowPosition={'last'}
          form={props.options.editing?.form}
          texts={{
            addRow: Enums.InterfaceTexts.addRowButton,
            editRow: Enums.InterfaceTexts.editRowButton,
            deleteRow: Enums.InterfaceTexts.deleteRowButton,
          }}
        />
        <StateStoring enabled={true} storageKey={props.options.name} />
      </DataGrid>
    </div>
  )
}

export default DataGridWrapper
