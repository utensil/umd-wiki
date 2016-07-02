const XLS = require('xlsx')

function sheet2RowArray (sheet, opts) {
  let val, row, r, isempty, R, C, v
  let header = []
  let body = []
  let range = {w: 0, h: 0}
  let out = {
    range: range,
    header: header,
    body: body
  }

  opts = opts || {}

  // determine the range
  if (!sheet['!ref']) return out
  r = XLS.utils.decode_range(sheet['!ref'])
  range.w = r.e.c - r.s.c + 1
  range.h = r.e.r - r.s.r + 1
  let headerRowCount = opts.headerRowCount || 1

  // header
  for (R = r.s.r; R < r.s.r + headerRowCount; ++R) {
    isempty = true
    row = []
    for (C = r.s.c; C <= r.e.c; ++C) {
      val = sheet[XLS.utils.encode_cell({c: C, r: R})]
      if (val) isempty = false
      val = val || {v: '', t: 's'}
      row.push(opts.raw ? v || val.v : XLS.utils.format_cell(val, v))
    }
    if (!isempty) header.push(row)
  }

  // body
  for (R = r.s.r + headerRowCount; R <= r.e.r; ++R) {
    isempty = true
    row = []
    for (C = r.s.c; C <= r.e.c; ++C) {
      val = sheet[XLS.utils.encode_cell({c: C, r: R})]
      if (val) isempty = false
      val = val || {v: '', t: 's'}
      row.push(opts.raw ? v || val.v : XLS.utils.format_cell(val, v))
    }
    if (!isempty) body.push(row)
  }

  out = {
    range: range,
    header: header,
    body: body
  }

  return out
}

function workbook2Json (workbook, opts) {
  let result = {}
  workbook.SheetNames.forEach((sheetName) => {
    let roa = sheet2RowArray(workbook.Sheets[sheetName], opts)
    if (roa.range.h > 0) {
      result[sheetName] = roa
    }
  })
  return result
}

function renderWorkbook (href, workbook, opts, cb) {
  let tabNav = $('<ul class="nav nav-tabs"></ul>')
  let tabContent = $('<div class="tab-content"></div>')

  let index = 0

  $.each(workbook, function (sheetName) {
    let sheetId = href + '-' + sheetName
    sheetId = sheetId.replace(/[-.#&/\\ \t]+/g, '')

    tabNav.append(
      $('<li></li>').
        addClass(index === opts.tab ? 'active' : '').
        append(
            $('<a></a>').
              text(sheetName).
              attr('href', '#' + sheetId).
              attr('data-toggle', 'tab')
          )
        )

    let tb = workbook[sheetName]

    let table = $('<table class="table table-bordered table-hover table-condensed table-striped"></table>')

    let thead = $('<thead></thead>')

    let maxCol = Math.min(tb.range.w, opts.maxColol)

    for (let r = 0; r < tb.header.length; r++) {
      let tr = $('<tr></tr>')

      for (let c = 0; c < maxCol; c++) {
        tr.append($('<th></th>').text(tb.header[r][c]))
      }

      thead.append(tr)
    }

    table.append(thead)

    let tbody = $('<tbody></tbody>')

    for (let r = 0; r < tb.body.length; r++) {
      let tr = $('<tr></tr>')

      for (let c = 0; c < maxCol; c++) {
        tr.append($('<td></td>').text(tb.body[r][c]))
      }

      tbody.append(tr)
    }

    table.append(tbody)

    $('td, th', table).css({
      'min-width': '7em'
    })

    tabContent.append(
      $('<div class="tab-pane"></div>').
        addClass(index === opts.tab ? 'active' : '').
        attr('id', sheetId).
        append(
          $('<div class="table-responsive"></div>').
            append(table)
          )
      )

    index++
  })

  let preview = $('<div class="xls-preview"></div>').
      css('margin-top', '1em').
      css('overflow-x', 'scroll').
      append(tabNav).
      append(tabContent)

  // only one tab
  if (index === 1) {
    tabNav.hide()
  } else {
    $('a', tabNav).click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  }

  if (cb) {
    cb(preview)
  }
}

fetch('wiki/test.xls').then(res => {
  res.arrayBuffer().then(a => {
    let data = new Uint8Array(a)
    let arr = []
    for (let i = 0; i !== data.length; ++i) {
      arr[i] = String.fromCharCode(data[i])
    }
    let b = arr.join('')
    let workbook = XLS.read(b, {type: 'binary'})

    renderWorkbook('wiki/test.xls', workbook2Json(workbook), {}, (preview) => {
      console.log('xls', preview.html())
      // TODO
      // $('#md-content-row').prepend(preview)
    })
  })
})
