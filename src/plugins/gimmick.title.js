$.md.stage('pregimmick').subscribe(function (done) {
  var siteTitle = window.$.md.config.title

  $('#md-content .markdown-body h1').each(function (index, h1) {
    if (index === 0) {
      var wikiTitle = $(h1).text()
      window.document.title = wikiTitle + '@' + siteTitle
    }
  })

  done()
})
