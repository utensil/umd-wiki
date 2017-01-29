setTimeout(function() {
  // From http://colorbrewer2.org/?type=diverging&scheme=Spectral&n=11
  var colors = ['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2',
    // ultra light blue background
    '#ebf5fc',
    // top level title
    '#376092',
    // dark blue in shadow
    '#254061'
    // mid blue
    '#4f81bd',
    // light blue
    '#95b3d7',
    // purple series
    // package fill
    '#bbb0cb',
    // package border
    '#886fa8',
    // component fill
    '#8064a2',
    // component border
    '#5c4776',
    // blue series
    // package fill
    '#a6d0df',
    // package border
    '#63b7ce',
    // component fill
    '#4bacc6',
    // component border
    '#357d91',
    // orange series
    // package fill
    '#fdc8a8',
    // package border
    '#f5a15a',
    // component fill
    '#f79646',
    // component border
    '#b66d31',
    // green series
    // package fill
    '#c8d9ac',
    // package border
    '#9bbb59',
    // component fill
    '#9bbb59',
    // component border
    '#71893f',
    // grey series
    // package fill
    '#d9d9d9',
    // package border
    '#afafaf',
    // component fill
    '#a6a6a6',
    // component border
    '#7f7f7f',
    // another blue series
    // darkest
    '#1f497d',
    // mid
    '#4f81bd',
    // dark mid
    '#5b89c4',
    // light mid
    '#57b3cd',
    // light
    '#93cddd',
    // red series
    // component fill
    '#c0504d',
    // component border
    '#8c3836',
    // blue seq
    '#a8ddb5',
    '#7bccc4',
    '#4eb3d3',
    '#2b8cbe',
    '#0868ac',
    '#084081',
    // green seq
    '#addd8e',
    '#78c679',
    '#41ab5d',
    '#238443',
    '#006837',
    '#004529',
    // orange seq
    '#fec44f'
    '#fe9929'
    '#ec7014'
    '#cc4c02'
    '#993404'
    '#662506'
    // red seq
    '#ffffcc',
    '#ffeda0',
    '#fed976',
    '#feb24c',
    '#fd8d3c',
    '#fc4e2a',
    '#e31a1c',
    '#bd0026',
    '#800026',
    // four major color
    '#4572a7',
    '#1a9850',
    '#ff7f0e',
    '#aa4643',
    // Color pairs:
    '#004529',
    '#41ab5d',
    '#084081',
    '#4eb3d3'
  ];

  var eleWikiTitle = $('#ultra-markdown-wiki');

  if ('rgb(255, 0, 0)' == eleWikiTitle.css('color')) {
    eleWikiTitle.text('Custom js & css working...');
    setInterval(function () {
      var index = Math.round(Math.random() * colors.length);
      eleWikiTitle.css('color', colors[index]);
    }, 1000);
  } else {
    eleWikiTitle.text('Custom js working...');
  }
}, 300);
