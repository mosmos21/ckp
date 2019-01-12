const LEFT = 25
const TOP = 25
const WIDTH = 250
const HEIGHT = 350

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
    ctx.font = `${fontSize}px 'メイリオ'`
    applyCharPos(textList, fontSize)
      .forEach(ele => ctx.fillText(ele.text, ele.x, ele.y))
  })
}

const calcFontSize = textList => Math.min.apply(null, [
  WIDTH,
  Math.floor(WIDTH / (textList.length * 2 - 1)),
  Math.floor(HEIGHT / Math.max.apply(null, textList.map(str => str.length)))
])

const applyCharPos = (textList, fontSize) =>
  textList.reverse().map((str, row) =>
    [...str].map((ch, col) => ({
      text: ch,
      x: (row * (fontSize * 2)) + offset(textList.length, fontSize),
      y: ((col + 1) * fontSize) + TOP,
    }))).flat()

const offset = (rowCount, fontSize) =>
  rowCount < 3
    ? LEFT + (WIDTH / rowCount / 2) - (fontSize / 2)
    : LEFT

const createBlob = () => {
  const bin = atob($('#cv')[0].toDataURL().split(',')[1])
  let buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i)
  }
  return new Blob([buffer.buffer], { type: 'image/png' })
}