function getTimeId () {
  var day = new Date()
  return '' + day.getUTCFullYear() + day.getUTCMonth() + day.getUTCDate() + day.getUTCHours() + day.getUTCMinute()
}
var seed = window.location.toString().match(/localhost/) ? Math.random() : getTimeId()

function addCss (css) {
  $('head').append('<link rel="stylesheet" href="' + css + '?_=' + seed + '" type="text/css" />')
}

function addJs (js) {
  $('head').append('<script type="text/javascript" src="' + js + '"></script>')
}

function isArray (a) {
  return a instanceof Array
}

function prepUrl (relativeUrl) {
  let baseUrl = window.$.md.config.baseUrl
  return `${baseUrl}/${relativeUrl}`
}

// addJs('dummy.js')
// addCss('dummy.css')

$.md.stage('pregimmick').subscribe(function (done) {
  try {
    let resources = window.$.md.config.resources || {}

    window.resources = {
      css: isArray(resources.css) ? resources.css : [],
      js: isArray(resources.js) ? resources.js : []
    }

    const JSON = window.JSON

    if (JSON.stringify(window.resources) !== window.resourcesStr) {
      window.resources.css.forEach(function (css) {
        addCss(prepUrl(css))
      })
      window.resources.js.forEach(function (js) {
        addJs(prepUrl(js))
      })
      window.resourcesStr = JSON.stringify(window.resources)
    }
  } catch (e) {
    console.log(e)
  } finally {
    done()
  }
})
