import {
  Eventbus,
  SimpleEventbus
} from './eventbus'

export class Global {
  public static eventbus: Eventbus = new SimpleEventbus()
}
