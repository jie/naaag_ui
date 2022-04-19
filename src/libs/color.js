import { rgb2hex } from "@/utils/image_tools"

export default class Color {
  constructor(code_name, rgbcode) {
    this.code_name = code_name
    this.rgbcode = rgbcode
    this.hexcode = rgb2hex(rgbcode)
  }

  toString() {
    return '(' + this.name + ')' + this.rgbcode;
  }
}
