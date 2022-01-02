import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DataChange } from 'devextreme/ui/data_grid'
import { RootState } from './store'
import _ from 'lodash'

import { IClientsListClientFirmData } from '../components/Main/ClientsList/ClientsList.interface'
import { IServicesListServiceData } from '../components/Main/ServicesList/ServicesList.interface'
import {
  getBruttoFromNetto,
  getVatFromNetto,
} from '../utils/currencyCalculations'
import { Enums } from '../constants/enums'

export interface IServices {
  [__KEY__: string]: IServicesListServiceData
}

interface IStates {
  clientFirm: IClientsListClientFirmData | null
  services: IServices
}

const states = {
  clientFirm: null,
  services: {},
}

const globalSlice = createSlice({
  name: 'global',
  initialState: states,
  reducers: {
    setClientFirm: (
      state: IStates,
      action: PayloadAction<IClientsListClientFirmData>
    ): void => {
      state.clientFirm = action.payload
    },
    updateService: (
      state: IStates,
      action: PayloadAction<DataChange<IServicesListServiceData, string>>
    ): void => {
      switch (action.payload.type) {
        case 'update':
          const modifiedServices: IServices = { ...state.services }
          const brutto: number = getBruttoFromNetto(
            action.payload.data?.netto as number
          )

          const vat: number = getVatFromNetto(
            action.payload.data?.netto as number
          )

          const netto: number = _.toNumber(action.payload.data?.netto as number)

          const newData: IServicesListServiceData = {
            name: action.payload.data?.name as string,
            netto: netto,
            brutto: brutto,
            key: action.payload.key,
            vat: vat,
            vatAsPercents: Enums.VatAsPercents,
          }
          console.log(newData)
          modifiedServices[action.payload.key as string] = newData
          state.services = modifiedServices

          break

        case 'remove':
          const clearedServices: IServices = { ...state.services }

          state.services = _.omit(clearedServices, [action.payload.key])

          break

        default:
          break
      }
    },
  },
})

export const getClientFirm = (
  state: RootState
): IClientsListClientFirmData | null => {
  return state.globalSlice.clientFirm
}

export const getServices = (state: RootState): IServices => {
  return state.globalSlice.services
}

export const { setClientFirm, updateService } = globalSlice.actions

export default globalSlice.reducer