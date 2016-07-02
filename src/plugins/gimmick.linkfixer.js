$.md.stage('pregimmick').subscribe((done) => {
  let baseUrl = window.$.md.config.baseUrl
  let currentMdUrlBase = window.location.hash.replace(/[^/]+\.md/, '')

  let processUrl = (url) => {
    let isExternalLink = /:\/\//.test(url)
    let isMdLink = /\.md$/.test(url)
    let isAnchor = /^#/.test(url)

    let ret = {
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
    let url = $(linkElement).attr('href')
    // console.log('link:', url)
    let urlInfo = processUrl(url)

    $(linkElement).attr('href', urlInfo.url)
    if (urlInfo.target) {
      $(linkElement).attr('target', urlInfo.target)
    }
  })

  $('#md-content img').each(function (index, linkElement) {
    let url = $(linkElement).attr('src')
    // console.log('image:', url)
    let urlInfo = processUrl(url)

    $(linkElement).attr('src', urlInfo.url)
  })

  done()
})
