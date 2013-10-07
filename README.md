bootstrap-bubble
================

A bootstrap module that combines the best features of popover and modal. It's everything I wanted popover to be.

Features:

- Click the background, the x o esc key to hide the bubble.
- Set an optional title with the title on the calling element or as an option in the arguments.
- More than one bubble can appear at a time if hideOthers : false is passed as an option in the arguments.
- click, or hover triggers.

Intelligent Placement
bubble will do it's best to place itself as directed.
- If placing right will go off the page but there is room enough on the left, it will switch to the left.
- If placing left will go off the page but there is room enough on the right, it will switch to the right.
- If placing top will go off the page but there is room enough on the bottom, it will switch to the bottom.
- If placing bottom will go off the page but there is room enough on the top, it will switch to the top.

the bubble will never go off the page when it appears. It's max left is 0px and it's marx right is the window width.
The arrow will attemt to remain pointing from the element which called it.

I admit it is not well browser tested. It works in IE9, Chrome and Firefox.

To Do:
- add resizing redraw.

