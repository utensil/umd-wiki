var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.dev.conf')
var fs = require('fs')

var app = express()
var compiler = webpack(config)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())
// serve webpack bundle output
app.use(devMiddleware)
// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)
// serve pure static assets
app.use('/static', express.static('./static'))

var TEST_WIKI_PATH = 'wiki'
var hasWikiDirectory = false

try {
  hasWikiDirectory = fs.statSync('./' + TEST_WIKI_PATH).isDirectory()
} catch (e) {
  hasWikiDirectory = false
}

if (hasWikiDirectory) {
  app.use('/' + TEST_WIKI_PATH, express.static('./' + TEST_WIKI_PATH))
}

// customization: mock config.json
var baseUrl = (hasWikiDirectory ? TEST_WIKI_PATH : 'static')
app.get('/config.json', function (req, res) {
  res.json({
    useSideMenu: true,
    lineBreaks: 'gfm',
    additionalFooterText: '',
    anchorCharacter: '&#x2693;',
    title: 'Ultra Markdown Wiki',
    showSearch: false,
    baseUrl: baseUrl
  })
});

// mock xls file
['test.xls', '测试.xls'].forEach(function (xlsFile) {
  app.get(['', baseUrl, encodeURI(xlsFile)].join('/'), function (req, res) {
    res.sendFile('./static/' + xlsFile, {
      root: process.cwd()
    })
  })
})

var port = process.env['PORT'] || 8080

app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port)
})
