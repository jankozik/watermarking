const config = {
  text: 'Hello world',
  font: '16px serif',
  opacity: 0.6,
  density: 1,
  rotate: (-1 / 6) * Math.PI,
  z_index: 2018,
  color: 'rgba(151,168,190)',
  yOffset: 3
}

class Watermark {
  constructor({
    text = config.text,
    opacity = config.opacity,
    density = config.density,
    rotate = config.rotate,
    z_index = config.z_index,
    font = config.font,
    color = config.color
  } = config) {
    this.text = text
    this.density = density
    this.opacity = opacity
    this.rotate = rotate
    this.z_index = z_index
    this.font = font
    this.color = color

    this._setStamp = () => {
      const canvasEl = document.createElement('canvas')
      const ctx = canvasEl.getContext('2d')

      ctx.fillStyle = this.color
      ctx.font = this.font
      const fontSize = this.font.replace(/(\d+)(?=px).*/, '$1')
      const text = ctx.measureText(this.text)
      const txtLen = text.width + fontSize * this.yOffset

      canvasEl.width = txtLen * 2
      canvasEl.height = txtLen * 2

      ctx.translate(txtLen, txtLen)
      ctx.rotate(this.rotate)
      ctx.fillStyle = this.color
      ctx.font = this.font
      ctx.fillText(this.text, fontSize * this.yOffset, 0)

      return canvasEl
    }

    this._compositeStamp = () => {
      const stamp = this._setStamp()
      const stampLen = stamp.getAttribute('width') / 2

      const canvasEl = document.createElement('canvas')
      //保证水印可以完全展示
      const len = 200 * this.density > stampLen ? 200 * this.density : stampLen
      canvasEl.width = len * 2
      canvasEl.height = len * 2
      const ctx = canvasEl.getContext('2d')
      ctx.translate(len, len)

      const sinValueByRotate = Math.sin(this.rotate)
      const cosValueByRotate = Math.cos(this.rotate)

      //  上左
      if (
        sinValueByRotate <= 0 &&
        sinValueByRotate > -1 &&
        cosValueByRotate > 0 &&
        cosValueByRotate <= 1
      ) {
        ctx.drawImage(
          stamp,
          stampLen,
          0,
          stampLen,
          stampLen,
          0,
          0,
          stampLen,
          stampLen
        )
        ctx.drawImage(
          stamp,
          stampLen,
          0,
          stampLen,
          stampLen,
          -len,
          -len,
          stampLen,
          stampLen
        )
      }
      // 上右
      if (
        sinValueByRotate < 0 &&
        sinValueByRotate >= -1 &&
        cosValueByRotate <= 0 &&
        cosValueByRotate < 1
      ) {
        ctx.drawImage(stamp, 0, 0, stampLen, stampLen, 0, 0, stampLen, stampLen)
        ctx.drawImage(
          stamp,
          0,
          0,
          stampLen,
          stampLen,
          -len,
          -len,
          stampLen,
          stampLen
        )
      }
      // 下右
      if (
        sinValueByRotate >= 0 &&
        sinValueByRotate < 1 &&
        cosValueByRotate < 0 &&
        cosValueByRotate >= -1
      ) {
        ctx.drawImage(
          stamp,
          0,
          stampLen,
          stampLen,
          stampLen,
          0,
          0,
          stampLen,
          stampLen
        )
        ctx.drawImage(
          stamp,
          0,
          stampLen,
          stampLen,
          stampLen,
          -len,
          -len,
          stampLen,
          stampLen
        )
      }
      // 下左
      if (
        sinValueByRotate > 0 &&
        sinValueByRotate <= 1 &&
        cosValueByRotate >= 0 &&
        cosValueByRotate < 1
      ) {
        ctx.drawImage(
          stamp,
          stampLen,
          stampLen,
          stampLen,
          stampLen,
          0,
          0,
          stampLen,
          stampLen
        )
        ctx.drawImage(
          stamp,
          stampLen,
          stampLen,
          stampLen,
          stampLen,
          -len,
          -len,
          stampLen,
          stampLen
        )
      }
      return canvasEl.toDataURL()
    }
  }
  embed(el) {
    if (!document.querySelector(el)) {
      console.error('el is ' + document.querySelector(el))
      return
    }
    const contain_el = document.querySelector(el)

    const watermark_img = this._compositeStamp()

    const watermark_div = document.createElement('div')
    watermark_div.setAttribute(
      'style',
      `
      position:absolute;
      width: 100%;
      height: 100%;
      background-image:url('${watermark_img}');
      opacity:0.6;
      z-index:${this.z_index};
      pointer-events: none;
    `
    )
    contain_el.style.position = 'relative'
    contain_el.insertBefore(watermark_div, contain_el.firstChild)
  }
}
export default Watermark
