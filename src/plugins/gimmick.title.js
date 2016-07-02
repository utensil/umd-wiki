$.md.stage('pregimmick').subscribe(function (done) {
  let siteTitle = window.$.md.config.title

  $('#md-content .markdown-body h1').each(function (index, h1) {
    if (index === 0) {
      let wikiTitle = $(h1).text()
      window.document.title = wikiTitle + '@' + siteTitle
    }
  })

  done()
})
