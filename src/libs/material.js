


export default class Material {
  constructor(name, has_bg = true, has_image = true, raw_data="") {
    this.name = name
    this.has_bg = has_bg
    this.has_image = has_image
    this.raw_data = raw_data
  }

  setImage() {

  }

  toString() {
    return '(' + this.name +  ')';
  }
}

