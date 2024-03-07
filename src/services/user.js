import { BehaviorSubject } from 'rxjs'
export default class User {
  userObj$ = new BehaviorSubject(null)
  state = {
    userObj: null
  }

  constructor () {
    const _this = this
    const storageUserObjStr = localStorage.getItem('userObj')
    if (storageUserObjStr && storageUserObjStr !== '') {
      _this.userObj$.next(JSON.parse(storageUserObjStr))
      _this.state.userObj = JSON.parse(storageUserObjStr)
    }
    _this.userObj$.subscribe(next => {
      _this.state.userObj = next
      if (next) {
        localStorage.setItem('userObj', JSON.stringify(next))
      } else {
        localStorage.removeItem('userObj')
      }
    })
  }

  static getInstance () {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }
}
