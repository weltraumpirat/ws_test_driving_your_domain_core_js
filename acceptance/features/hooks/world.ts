import {setWorldConstructor} from 'cucumber'

function World() {
  this.example = true
}

setWorldConstructor(World)
