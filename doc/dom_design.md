DOM Design
=======================

Design Goal: Mostly compatible with [Dynalon/mdwiki](https://github.com/Dynalon/mdwiki).


```jade
#md-all
  #md-menu
    nav#md-main-navbar
      .navbar-brand
  #md-body-container.container
    #md-body-row.row
      #md-body
        #md-title-container.container
          #md-title-row.row
            #md-title.col-md-12
              .page-header
                h1
        #md-menu-container.container
          #md-menu-row.row
        #md-content-container.container
          #md-content-row.row
            #md-left-column.col-md-3
            #md-content.col-md-9
```
