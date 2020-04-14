import {After} from 'cucumber'
import {Global} from '../../../src/global'

After(function () {
  Global.eventbus.release()
})
