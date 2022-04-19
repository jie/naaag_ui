function ApiRequestDeco(...args) {
  var func = function (target, name, descriptor) {
    const old = descriptor.value
    descriptor.value = async function () {
      if (this.apiLoading) {
        return
      }
      this.apiLoading = true
      try {
        await old.apply(this, arguments)
      } catch (e) {
        console.error(e)
      }
      this.apiLoading = false
    }
    return descriptor
  }

  return func
}


function uploadRequestDeco(...args) {
  var func = function (target, name, descriptor) {
    const old = descriptor.value
    descriptor.value = async function () {
      if (this.apiLoading) {
        return
      }
      this.apiLoading = true
      try {
        await old.apply(this, arguments)
      } catch (e) {
        console.error(e)
      }
      this.apiLoading = false
    }
    return descriptor
  }

  return func
}

export {
  ApiRequestDeco,
  uploadRequestDeco
}