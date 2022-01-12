import { useEffect, useRef } from 'react'
import { Dispatch } from 'redux'
import { nanoid } from '@reduxjs/toolkit'
import dxDataGrid from 'devextreme/ui/data_grid'
import DataSource from 'devextreme/data/data_source'
import _ from 'lodash'

import DataGrid from '../../devExtreme/DataGrid/DataGrid'

import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { setClientFirm } from '../../../Redux-store/global.reducer'
import createClient from '../../../api/client/createClient'
import updateClient from '../../../api/client/updateClient'
import deleteClient from '../../../api/client/deleteClient'
import getClients from '../../../api/client/getClients'

import {
  IDataGridEventOnSelectionChanged,
  IDataGridEventOnInitialized,
  IDataGridOptions,
} from '../../devExtreme/DataGrid/DataGrid.interface'
import { IClientsListClientFirmData } from './ClientsList.interface'
import { ICreateClientDto } from '../../../../../backend/src/clients/dtos/create.interface'
import { IDeleteClientDto } from '../../../../../backend/src/clients/dtos/delete.interface'
import { IUpdateClientDto } from '../../../../../backend/src/clients/dtos/update.interface'

import { getColumns } from './ClientsList.options'

const ClientsList = (): JSX.Element => {
  const dispatch: Dispatch = useAppDispatch()
  const clientsListData = useRef<IClientsListClientFirmData[]>()
  const gridComponent = useRef<dxDataGrid>()

  const isMounted = useRef<boolean>(false)
  const isReadyResolve = useRef<(value: boolean) => void>()
  const isReadyReject = useRef<(reason: string) => void>()
  const isReady = useRef<Promise<boolean>>(
    new Promise((resolve, reject) => {
      isReadyResolve.current = resolve
      isReadyReject.current = reject
    })
  )

  useEffect(() => {
    isMounted.current = true

    return () => {
      if (_.isFunction(isReadyReject.current)) {
        isReadyReject.current('unmounted')
      }
      isMounted.current = false
    }
  }, [])

  const onInitialized = (e: IDataGridEventOnInitialized): void => {
    if (_.isFunction(isReadyResolve.current)) {
      isReadyResolve.current(true)
    }
    gridComponent.current = e.component
  }

  const onSelectionChanged = (e: IDataGridEventOnSelectionChanged): void => {
    if (!_.isEmpty(e?.selectedRowKeys)) {
      dispatch(
        setClientFirm(_.last(e.selectedRowsData) as IClientsListClientFirmData)
      )
    }
  }

  const dataSource = useRef<DataSource>(
    new DataSource({
      load: async () => {
        const response = getClients()
        const store = (await response).data

        if (isMounted.current) {
          clientsListData.current = store
        }
        return store
      },

      insert: (clientData: IClientsListClientFirmData) => {
        const key: string = _.camelCase(_.toLower(nanoid(8)))
        const createdClient: ICreateClientDto = { ...clientData, key }

        return createClient(createdClient) as PromiseLike<any>
      },
      remove: (key: number) => {
        const options: IDeleteClientDto = { key: _.toString(key) }

        return deleteClient(options) as PromiseLike<any>
      },
      update: (key: number, clientData: IClientsListClientFirmData) => {
        const updatingClient: IUpdateClientDto = {
          ...clientData,
          key: _.toString(key),
        }
        console.log('update', key, updatingClient)
        return updateClient(updatingClient) as PromiseLike<any>
      },
      key: 'key',
    })
  )

  const gridOptions = useRef<IDataGridOptions>({
    name: 'data-grid-clients',
    dataSource: dataSource.current,
    columns: getColumns(),
    selection: { mode: 'single' },
    columnAutoWidth: true,
    focusedRowEnabled: true,
    onInitialized,
    onSelectionChanged,
  })

  return <DataGrid options={gridOptions.current} />
}

export default ClientsList
