$.md.stage('pregimmick').subscribe(function(done) {

  function prepare_tocible() {
    // let #md-content make way for toc siderbar
    $('#md-content').
      removeClass('col-md-12').
      addClass('col-md-10 col-md-offset-2');
  }

  function remove_tocible() {
    $(".tocible").hide(300, function () {
      $(".tocible").remove();
      $('#md-content').
        removeClass('col-md-10 col-md-offset-2').
        addClass('col-md-12');
    });

  }

  function show_tocible() {
    $(".tocible").css({
      'visibility': 'visible'
    });
  }

  $('#md-content-row').
    prepend(
      $('<div class="ref" style="position: absolute; left: 2.5rem; top: 200px; width: 10px; height: 10px"></div>')
    );

  prepare_tocible();

  setTimeout(function () {
    $('#md-content-row').tocible({
        heading: 'h2', //[selector], the first level heading
        subheading: 'h3', //[selector], the second level heading
        reference:'.ref', //[selector], reference element for horizontal positioning
        title: '～～～', //[selector or string], title of the menu
        hash: false, //[boolean], setting true will enable URL hashing on click
        offsetTop: 20, //[number], spacing/margin above the menu
        speed: 600, //[number or string ('slow' & 'fast')], duration of the animation when jumping to the clicked content
        collapsible: true, //[boolean], enabling true will auto collapse sub level heading not being scrolled into
        maxWidth: $('#md-content-row').width() - $('#md-content').width()
        // 200 //[number], set max-width of the navigation menu
    });

    // ensure responsive behavior on mobile devices
    $(".tocible").addClass('hidden-sm hidden-xs').css({
      'visibility': 'hidden'
    });

    setTimeout(function () {
      var heading_count = $(".tocible > ul > li.tocible_heading").length;

      // do not show tocible if there's no section at all
      if(heading_count < 1) {
        remove_tocible();
      } else {
        show_tocible();
      }

      // click the arrow on tocible makes it disappear
      $('.tocible_header').click(function () {
        remove_tocible();
        // console.log('remove_tocible');
      });
    });

  });

  done();
});
