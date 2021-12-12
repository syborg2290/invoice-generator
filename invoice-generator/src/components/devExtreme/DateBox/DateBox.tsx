import { useResizeDetector } from 'react-resize-detector'
import { DateBox } from 'devextreme-react'

import dxService from '../../../utils/dxService'

import {
  IDateBoxEventOnValueChanged,
  IDateBoxOptions,
} from './DateBox.interface'
import { IOptions } from '../../components.interface'

import resizeDetector from '../resizeDetector.module.css'

const DateBoxWrapper = (props: IOptions<IDateBoxOptions>): JSX.Element => {
  const { width, height, ref } = useResizeDetector()

  return (
    <div className={resizeDetector.box} ref={ref}>
      <DateBox
        value={new Date()}
        width={width}
        height={height}
        hint={props.options.hint}
        onValueChanged={(e: IDateBoxEventOnValueChanged) =>
          dxService.callFromProps(props, 'onValueChanged', e)
        }
      />
    </div>
  )
}

export default DateBoxWrapper
