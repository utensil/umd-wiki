$.md.stage('pregimmick').subscribe(function (done) {
  var baseUrl = window.$.md.config.baseUrl

  // console.log('baseUrl', baseUrl)

  var currentMdUrlBase = window.location.hash.replace(/[^/]+\.md/, '')

  // console.log('currentMdUrlBase', currentMdUrlBase)

  var processUrl = function (url) {
    var isExternalLink = /:\/\//.test(url)
    var isMdLink = /\.md$/.test(url)
    var isAnchor = /^#/.test(url)

    var ret = {
      url: url
    }

    if (isExternalLink) {
      ret.target = '_blank'
    } else if (!isAnchor) {
      if (isMdLink) {
        ret.url = (currentMdUrlBase + url).replace(/\/\//g, '/')
      } else {
        ret.url = (baseUrl + '/' + currentMdUrlBase.replace('#!', '') + url).replace(/\/\//g, '/')
      }
    }

    return ret
  }

  $('#md-content a').each(function (index, linkElement) {
    var url = $(linkElement).attr('href')
    // console.log('link:', url)
    var urlInfo = processUrl(url)

    $(linkElement).attr('href', urlInfo.url)
    if (urlInfo.target) {
      $(linkElement).attr('target', urlInfo.target)
    }
  })

  $('#md-content img').each(function (index, linkElement) {
    var url = $(linkElement).attr('src')
    // console.log('image:', url)
    var urlInfo = processUrl(url)

    $(linkElement).attr('src', urlInfo.url)
  })

  done()
})
