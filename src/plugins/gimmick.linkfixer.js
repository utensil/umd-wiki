$.md.stage('pregimmick').subscribe(function(done) {
  var links = $('#md-content a')

  var baseUrl = window.$.md.config.baseUrl

  console.log('baseUrl', baseUrl)

  // function urlNormalize(url, currentUrl) {
  //   var parts = url.split(/:\/\//)
  //   var protocolPart = ''
  //   var urlMainPart = ''
  //   var hasProtocolPart = false
  //   if (parts.length == 2) {
  //     hasProtocolPart = true
  //     protocolPart = parts[0]
  //     urlMainPart = parts[1]
  //   } else {
  //     hasProtocolPart = false
  //     protocolPart = ''
  //     urlMainPart = parts[0]
  //   }

  //   var pathParts = urlMainPart.split('/')
  //   for (var i = 0; i < pathParts.length; ++i) {
  //     var part = pathParts[i]

  //     if ()
  //   }
  // }

  var currentMdUrlBase = window.location.hash.replace(/[^/]+\.md/, '')

  console.log('currentMdUrlBase', currentMdUrlBase)

  links.each(function (index, linkElement) {
    var href = $(linkElement).attr('href')
    console.log('href', href)

    var isExternalLink = /:\/\//.test(href)
    var isMdLink = /\.md$/.test(href)
    var isAnchor = /^#/.test(href)

    if (isExternalLink) {
      $(linkElement).attr('target', '_blank')
    } else if (!isAnchor) {
      if (isMdLink) {
        $(linkElement).attr('href', (currentMdUrlBase + href).replace(/\/\//g, '/'))
      } else {
        console.log(linkElement)
        var url = (baseUrl + '/' + currentMdUrlBase.replace('#!', '') + href).replace(/\/\//g, '/')
        $(linkElement).attr('href', url)
      }
    }
  })

  done()
})