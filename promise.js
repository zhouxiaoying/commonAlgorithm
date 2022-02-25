function Promise(executor) {
    var _this = this
    var status = 'pending'
    var value = 'undefined'
    var reason = 'undefined'
    this.onFulfilled = []
    this.onRejected = []

    function resolve(value) {
        if (_this.status === 'pending') {
            _this.status = 'fulfilled'
            _this.value = value
            _this.onFulfilled.forEach(fn => fn(value))
        }
    }

    function reject(reason) {
        if (_this.status === 'pending') {
            _this.status = 'rejected'
            _this.reason = reason
            _this.onRejected.forEach(fn => fn(reason))
        }
    }
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
    // if(this.status === 'fulfilled'){
    //     typeof onFulfilled === 'function' && onFulfilled(this.value)
    // }
    // if(this.status === 'rejected'){
    //     typeof onRejected === 'function' && onRejected(this.reason)
    // }
    // if(this.status === 'pending'){
    //     typeof onFulfilled === 'function' && this.onFulfilled.push(onFulfilled)
    //     typeof onRejected === 'function' && this.onRejected.push(onRejected)
    // }
    var _this = this
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
        throw reason
    }
    let promise2 = new Promise((resolve, reject) => {
        if (_this.status === 'fulfilled') {
            setTimeout(() => {
                try {
                    let x = onFulfilled(_this.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        } else if (_this.status === 'rejected') {
            setTimeout(() => {
                try {
                    let x = onRejected(_this.reason)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        } else if (_this.status === 'pending') {
            _this.onFulfilled.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(_this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            })
            _this.onRejected.push(() => {
                setTimeout(() => {
                    try {
                        let x = onRejected(_this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            })
        }
    })
    return promise2
}
function resolvePromise(promise2,x,resolve,reject){
    if(promise2 === x){
        reject(new TypeError('cycle'))
    }
    if(x && typeof x === 'object' || typeof x === 'function'){
        let used 
        try{
            let then = x.then
            if(typeof then === 'function'){
                then.call(x,(y)=>{
                    if(used)return
                    used = true
                    resolvePromise(promise2,y,resolve,reject)
                },(r)=>{
                    if(used) return
                    used = true
                    reject(r)
                })
            }else{
                if(used)return
                used = true
                resolve(x)
            }
        }catch(e){
            if(used)return
            used = true
            reject(e)
        }
    }else{
        resolve(x)
    }
}
module.exports = Promise