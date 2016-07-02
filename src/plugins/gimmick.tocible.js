$.md.stage('pregimmick').subscribe(function (done) {
  function prepareTocible () {
    // let #md-content make way for toc siderbar
    $('#md-content').
      removeClass('col-md-12').
      addClass('col-md-10')
  }

  function removeTocible () {
    $('.tocible').hide(300, function () {
      $('.tocible').remove()
      $('#md-content').
        removeClass('col-md-10').
        addClass('col-md-12')
    })
  }

  function showTocible () {
    $('.tocible').css({
      'visibility': 'visible'
    })
  }

  $('#md-content-row .ref').remove()

  // .9375rem
  var ONE_REM_IN_PX = 60
  var LEFT_MARGIN_IN_PX = ONE_REM_IN_PX

  $('#md-content-row').
    prepend(
      $('<div class="ref col-md-2"></div>').css({left: LEFT_MARGIN_IN_PX})
    )

  prepareTocible()

  setTimeout(function () {
    $('#md-content-row').tocible({
      heading: 'h2', // [selector], the first level heading
      subheading: 'h3', // [selector], the second level heading
      reference: '.ref', // [selector], reference element for horizontal positioning
      title: '～～～', // [selector or string], title of the menu
      hash: false, // [boolean], setting true will enable URL hashing on click
      offsetTop: 30, // [number], spacing/margin above the menu
      speed: 600, // [number or string ('slow' & 'fast')], duration of the animation when jumping to the clicked content
      collapsible: true, // [boolean], enabling true will auto collapse sub level heading not being scrolled into
      maxWidth: $('#md-content-row').width() - $('#md-content').width() - LEFT_MARGIN_IN_PX
      // 200 // [number], set max-width of the navigation menu
    })

    // ensure responsive behavior on mobile devices
    $('.tocible').addClass('hidden-sm hidden-xs').css({
      'visibility': 'hidden'
    })

    setTimeout(function () {
      var headingCount = $('.tocible > ul > li.tocible_heading').length

      // do not show tocible if there's no section at all
      if (headingCount < 1) {
        removeTocible()
      } else {
        showTocible()
      }

      // click the arrow on tocible makes it disappear
      $('.tocible_header').click(function () {
        removeTocible()
        // console.log('removeTocible')
      })
    })
  })

  done()
})
