bootstrap-bubble
================

A Bootstrap 2.3.2 module that combines the best features of popover and modal and it has intellignet placement. If the bubble will place off the page, the placement algorithm will either swithc placement choice or shift the bubble content to fit on the page. It's everything I wanted popover to be.

Features:

- Esc key to hide the bubble.
- Option to click the background to hide it if clickClose : true is passed as an option.
- Set an optional title with the title on the calling element or as an option in the arguments.
- Option so more than one bubble can appear at a time if hideOthers : false is passed as an option in the arguments.
- click, or hover triggers.

Intelligent Placement
bubble will do it's best to place itself as directed.
- If placing right will go off the page but there is room enough on the left, it will switch to the left.
- If placing left will go off the page but there is room enough on the right, it will switch to the right.
- If placing top will go off the page but there is room enough on the bottom, it will switch to the bottom.
- If placing bottom will go off the page but there is room enough on the top, it will switch to the top.

the bubble will never go off the page when it appears. It's max left is 0px and it's max right is the window width.
The arrow will attemt to remain pointing from the element which called it.

It works in IE9, Chrome and Firefox. Probably other browsers too.

To Do:
- add resizing redraw.
- Window placement vs calling element.
