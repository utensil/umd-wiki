const XLS = require('xlsx')

const sheet2RowArray = (sheet, opts) => {
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

const workbook2Json = (workbook, opts) => {
  let result = {}
  workbook.SheetNames.forEach((sheetName) => {
    let roa = sheet2RowArray(workbook.Sheets[sheetName], opts)
    if (roa.range.h > 0) {
      result[sheetName] = roa
    }
  })
  return result
}

const renderWorkbook = (href, workbook, opts, cb) => {
  let tabNav = $('<ul class="nav nav-tabs" role="tablist"></ul>')
  let tabContent = $('<div class="tab-content"></div>')

  let index = 0

  console.debug('opts = ', opts)

  $.each(workbook, function (sheetName) {
    let sheetId = href + '-' + sheetName
    sheetId = sheetId.replace(/[-.#&/\\ \t]+/g, '')

    tabNav.append(
      $('<li class="nav-item"></li>').
        // addClass(index === opts.tab ? 'active' : '').
        append(
            $('<a class="nav-link" role="tab"></a>').
              addClass(index === opts.tab ? 'active' : '').
              text(sheetName).
              attr('href', '#' + sheetId).
              attr('data-toggle', 'tab')
          )
        )

    let tb = workbook[sheetName]

    // console.debug(tb)

    let table = $('<table class="table table-hover table-sm table-striped"></table>')

    let thead = $('<thead></thead>')

    // console.debug('maxCol = min of ', tb.range.w, opts.maxCol)

    let maxCol = Math.min(tb.range.w, opts.maxCol)

    for (let r = 0; r < tb.header.length; r++) {
      let tr = $('<tr></tr>')

      for (let c = 0; c < maxCol; c++) {
        // console.debug('header', r, c, tb.header[r][c])
        tr.append($('<th></th>').text(tb.header[r][c]))
      }

      thead.append(tr)
    }

    table.append(thead)

    let tbody = $('<tbody></tbody>')

    for (let r = 0; r < tb.body.length; r++) {
      let tr = $('<tr></tr>')

      for (let c = 0; c < maxCol; c++) {
        // console.debug('body', r, c, tb.body[r][c])
        tr.append($('<td></td>').text(tb.body[r][c]))
      }

      tbody.append(tr)
    }

    table.append(tbody)

    $('td, th', table).css({
      'min-width': '7em'
    })

    tabContent.append(
      $('<div class="tab-pane" role="tabpanel"></div>').
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

  // do not show tabs if there's only one tab
  if (index === 1) {
    tabNav.hide()
  } else {
    // FIXME the tabs don't work except for the first
    $('a', tabNav).click(function (e) {
      e.preventDefault()
      // $(this).tab('show')
    })
  }

  if (cb) {
    // console.debug(preview)
    cb(preview)
  }
}

const fetchAndRenderXls = (href, opts, cb) => {
  // console.debug('fetching', href)
  fetch(href).then(res => {
    res.arrayBuffer().then(a => {
      let data = new Uint8Array(a)
      let arr = []
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i])
      }
      let b = arr.join('')
      let workbook = XLS.read(b, {type: 'binary'})
      let callback = _.isFunction(cb) ? cb : () => {}
      let wb = workbook2Json(workbook, opts)
      // console.debug('fetched', href, res, wb)
      renderWorkbook(href, wb, opts, callback)
    })
  })
}

$.md.stage('pregimmick').subscribe((done) => {
  let xlsPreviewGimmick = {
    name: 'xlspreview',
    version: $.md.version,
    once: function () {
      $.md.linkGimmick(this, 'xlspreview', xlsPreview)
    }
  }
  $.md.registerGimmick(xlsPreviewGimmick)

  function xlsPreview ($links, opts, href) {
    // console.debug($links, opts, href)
    opts.text = opts.text || '<i class="fa fa-download"></i>&nbsp;'
    opts.preview = opts.preview || '<i class="fa fa-eye"></i>&nbsp;'
    opts.open = opts.open || 'auto' // or 'toggle'
    opts.headerRowCount = opts.header_row_count || 1
    opts.maxCol = opts.max_col || 20
    opts.tab = opts.tab || 0

    if (!href.endsWith('/')) {
      href += '/'
    }

    return $links.each(function (i, link) {
      var href = $(link).attr('href')
      // console.log(i, link, href)
      if (opts.open === 'toggle') {
        // console.debug('xlspreview: toggle')
        let previewButton = $('<a class="btn btn-secondary"></a>')
        let renderedPreview = null

        previewButton.
          html(opts.preview).
          css('margin-left', '1em')

        $(link).after(previewButton)

        previewButton.
          click(function (e) {
            if (renderedPreview && renderedPreview !== '') {
              renderedPreview.toggle()
            } else if (renderedPreview === '') {
              return
            } else {
              previewButton.html(opts.preview + '<i class="fa fa-spinner fa-spin"></i>')
              renderedPreview = ''

              fetchAndRenderXls(href, opts, function (preview) {
                renderedPreview = preview
                previewButton.after(renderedPreview)
                previewButton.html(opts.preview)
              })
            }
          })
      } else /* if (opts.open === 'toggle') */ {
        // console.debug('xlspreview: auto')
        fetchAndRenderXls(href, opts, function (preview) {
          // console.debug('fetchAndRenderXls', href, link, preview)
          $(link).after(preview)
        })
      }

      // the link itself becomes a download button
      $(link).
        html(opts.text || href).
        addClass('btn').
        addClass('btn-secondary')

      if (opts.open !== 'toggle') {
        $(link).css({
          float: 'right'
        })
      }
    })
  }
  done()
})
//   const TEST_XLS_FILE_NAME = 'wiki/测试.xls'
//   fetch(encodeURI(TEST_XLS_FILE_NAME)).then(res => {
//     res.arrayBuffer().then(a => {
//       let data = new Uint8Array(a)
//       let arr = []
//       for (let i = 0; i !== data.length; ++i) {
//         arr[i] = String.fromCharCode(data[i])
//       }
//       let b = arr.join('')
//       let workbook = XLS.read(b, {type: 'binary'})
//       let opts = {
//         text: '<i class="fa fa-download"></i>',
//         preview: '<i class="fa fa-eye"></i>',
//         open: 'toggle',
//         headerRowCount: 1,
//         maxCol: 20,
//         tab: 0
//       }
//
//       renderWorkbook(TEST_XLS_FILE_NAME, workbook2Json(workbook, opts), opts, (preview) => {
//         console.log('xls', preview.html())
//         $('article#preview.markdown-body').prepend(preview)
//         done()
//       })
//     })
//   })
// })
