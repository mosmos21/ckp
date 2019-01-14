const LEFT = 25
const TOP = 25
const WIDTH = 250
const HEIGHT = 350
const ROTATE = [
  '~', '-', '(', ')', '/', '=',
  '〜', 'ー', '（', '）', '／', '＝'
]

$(function () {
  const ctx = $('#cv')[0].getContext('2d')
  ctx.fillStyle = 'white'
  $('#download').click(() => {
    const url = window.URL.createObjectURL(createBlob(atob($('#cv')[0].toDataURL().split(',')[1])))
    $(`<a href="${url}" download="export.png" />`)[0].click()
  })
  $('#text').keyup(e => {
    var img = new Image()
    img.src = 'image/back.png'
    $(img).on('load', () => {
      ctx.drawImage(img, 0, 0)
      const textList = $(e.target).val().split('\n') || []
      const fontSize = calcFontSize(textList)
      ctx.font = `${fontSize}px メイリオ`
      applyCharPosition(textList, fontSize).forEach(ele => {
        const [offsetX, offsetY, rotate] = ROTATE.includes(ele.text)
          ? [0, fontSize * 0.1, Math.PI / 2]
          : [0, fontSize, 0]
        ctx.save()
        ctx.translate(Math.floor(ele.x + offsetX), Math.floor(ele.y + offsetY));
        ctx.rotate(rotate)
        ctx.fillText(ele.text, 0, 0)
        ctx.restore()
      })
    })
  }).keyup()
})

const calcFontSize = textList => Math.min(
  Math.floor(WIDTH / (textList.length * 2 - 1)),
  Math.floor(HEIGHT / Math.max.apply(null, textList.map(str => str.length)))
)

const applyCharPosition = (textList, fontSize) => {
  const lineWidth = WIDTH / (textList.length * 2 - 1)
  return textList.reverse().map((str, row) => [...str].map(
    (ch, col) => ({
      text: ch,
      x: LEFT + (row * (lineWidth * 2)) + (lineWidth - fontSize) / 2,
      y: TOP + (col * fontSize),
    }))).flat()
}

const createBlob = bin => new Blob(
  [new Uint8Array(bin.length).map((_, i) => bin.charCodeAt(i)).buffer],
  { type: 'image/png' }
)