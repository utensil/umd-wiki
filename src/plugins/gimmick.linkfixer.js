$.md.stage('pregimmick').subscribe((done) => {
  let getCurrentMdUrlBase = () => {
    let hash = window.location.hash.toString()
    let parts = hash.split('#!')
    if (parts.length >= 2) {
      return parts[parts.length - 1].replace(/[^/]+\.md(#.+)?/, '')
    }
  }

  let baseUrl = window.$.md.config.baseUrl
  let currentMdUrlBase = getCurrentMdUrlBase()

  let getCurrentMdRelativeUrl = () => {
    let hash = window.location.hash.toString()
    let parts = hash.split('#!')
    if (parts.length >= 2) {
      let mdFileAndAnchor = parts[parts.length - 1].split('#')
      if (mdFileAndAnchor.length === 1 || mdFileAndAnchor.length === 2) {
        return mdFileAndAnchor[0]
      }
    }

    // TODO all unhandled exceptional case goes to index.md for now
    return 'index.md'
  }

  let processUrl = (url) => {
    let isExternalLink = /:\/\//.test(url)
    let isMdLink = /\.md$/.test(url)
    let isAnchor = /^#/.test(url)

    let ret = {
      url: url
    }

    if (isExternalLink) {
      ret.target = '_blank'
    } else {
      if (!isAnchor) {
        if (isMdLink) {
          ret.url = (currentMdUrlBase + url).replace(/\/\//g, '/')
        } else {
          ret.url = (baseUrl + '/' + currentMdUrlBase.replace('#!', '') + url).replace(/\/\//g, '/')
        }
      }
    }
    return ret
  }

  $('#md-content a').each((index, linkElement) => {
    let url = $(linkElement).attr('href')
    // console.log('link:', url)
    let urlInfo = processUrl(url)

    $(linkElement).attr('href', urlInfo.url)
    if (urlInfo.target) {
      $(linkElement).attr('target', urlInfo.target)
    }
  })

  $('#md-content a.anchor').each((index, linkElement) => {
    let url = $(linkElement).attr('href')
    let parts = url.split('#')
    let anchor = parts[parts.length - 1] || ''
    // console.log('anchor:', anchor)
    // console.log('getCurrentMdRelativeUrl() =>', getCurrentMdRelativeUrl())
    let urlFixed = `#!${getCurrentMdRelativeUrl()}#${anchor}`.replace(/\/\//g, '/')

    $(linkElement).attr('href', urlFixed)
  })

  $('#md-content img').each((index, linkElement) => {
    let url = $(linkElement).attr('src')
    // console.log('image:', url)
    let urlInfo = processUrl(url)

    $(linkElement).attr('src', urlInfo.url)
  })

  done()
})
