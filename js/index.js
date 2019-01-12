const LEFT = 25
const TOP = 25
const WIDTH = 250
const HEIGHT = 350
const ROTATE = [
  '~', '〜', '-', 'ー',
  '(', '（', ')', '）',
  '/', '／'
]
const FONT_FAMILY = '"Courier New", Consolas, monospace'

$(function () {
  const ctx = $('#cv')[0].getContext('2d')
  ctx.fillStyle = 'white'

  $('#download').click(() =>
    $(`<a id="link" href="${window.URL.createObjectURL(createBlob())}" download="export.png">download</a>`)[0].click())
  $('#text').keyup(e => draw(ctx, $(e.target).val().split('\n')))
  draw(ctx)
})

const draw = (ctx, textList = []) => {
  var img = new Image()
  img.src = "image/back.png"
  $(img).on('load', () => {
    ctx.drawImage(img, 0, 0)
    const fontSize = calcFontSize(textList)
    ctx.font = `${fontSize}px  ${FONT_FAMILY}`
    applyCharPos(textList, fontSize)
      .forEach(ele => {
        const [offsetX, offsetY, rotate] = ROTATE.includes(ele.text)
          ? [0, fontSize * 0.1, Math.PI / 2]
          : [0, fontSize, 0]
        ctx.save()
        ctx.translate(parseInt(ele.x + offsetX), parseInt(ele.y + offsetY));
        ctx.rotate(rotate)
        ctx.fillText(ele.text, 0, 0)
        ctx.restore()
      })
  })
}

const calcFontSize = textList => Math.min.apply(null, [
  WIDTH,
  Math.floor(WIDTH / (textList.length * 2 - 1)),
  Math.floor(HEIGHT / Math.max.apply(null, textList.map(str => str.length)))
])

const applyCharPos = (textList, fontSize) => {
  const lineWidth = WIDTH / (textList.length * 2 - 1)
  return textList.reverse().map((str, row) =>
    [...str].map((ch, col) => ({
      text: ch,
      x: LEFT + (row * (lineWidth * 2)) + lineWidth / 2 - fontSize / 2,
      y: TOP + (col * fontSize),
    }))).flat()
}

const createBlob = () => {
  const bin = atob($('#cv')[0].toDataURL().split(',')[1])
  let buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i)
  }
  return new Blob([buffer.buffer], { type: 'image/png' })
}