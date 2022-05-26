export default function draggableTableRows(
  ref,
  opts
) {
  const table = typeof ref === 'string'
    ? document.getElementById(ref).querySelector('table')
    : ref;
  // Table must have relative positioning.
  table.style.position = 'relative';

  const defaults = {
    onDrop: () => {},
    onIntersect: () => {},
    enableIsDraggingStyling: false,
    style: {
      fontSize: '0.95rem',
      textIndent: '50px',
      zIndex: 10,
      cursor: 'grabbing',
      boxShadow: '0px 5px 8px -1px rgba(0,0,0,0.11), 0px 2px 4px -2px rgba(0,0,0,0.11)',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      draggingBackgroundColor: '#d8dbdd',
      draggingTextColor: '#000000'
    }
  };

  let currRowStyle = {};

  opts = {
    ...defaults,
    ...opts
  };

  let currRow = null,
      dragRow = null,
      mouseDownX = 0,
      mouseDownY = 0,
      mouseX = 0,
      mouseY = 0,
      mouseDrag = false;

  const mousedownEvent = (event) => {
    // Left click only.
    if(event.button === 0) {
      let target = getTargetRow(event.target);

      if(target) {
        currRow = target;
        addDraggableRow(target);
        currRow.classList.add('is-dragging');

        mouseDownX = event.clientX;
        mouseDownY = event.clientY;

        mouseDrag = true;
        if(opts.enableIsDraggingStyling) {
          applyIsDraggingStyle();
        }
      }
    }
  }

  const mousemoveEvent = (event) => {
    if(mouseDrag) {
      mouseX = event.clientX - mouseDownX;
      mouseY = event.clientY - mouseDownY;

      moveRow(mouseX, mouseY);
    }
  };

  const mouseupEvent = () => {
    if(mouseDrag) {
      if(opts.enableIsDraggingStyling) {
        resetIsDraggingStyle();
      }
      currRow.classList.remove('is-dragging');
      table.removeChild(dragRow);
      opts.onDrop(currRow);
      dragRow = null;
      mouseDrag = false;
    }
  };

  function init() {
    table.addEventListener('mousedown', mousedownEvent);
    table.addEventListener('mousemove', mousemoveEvent);
    table.addEventListener('mouseup', mouseupEvent);
  }

  function swapRow(row, rowIndex) {
    let tbody = table.querySelector('tbody');
    let dragIndex = Array.from(tbody.children).indexOf(currRow);
    let after = dragIndex > rowIndex;

     tbody.insertBefore(
       after ? currRow : row,
       after ? row : currRow
     );
  }

  function moveRow(x, y) {
    dragRow.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";

    let dragPos = dragRow.getBoundingClientRect();
    const rows = getRows()
    for (let row of rows) {
      let rowPos = row.getBoundingClientRect();
      if(currRow !== row
        && isIntersecting(
          dragPos.y,
          (dragPos.y + dragPos.height),
          rowPos.y,
          rowPos.y + rowPos.height)
        ) {
        if(Math.abs(dragPos.y - rowPos.y) < rowPos.height / 2) {
          opts.onIntersect(row, currRow);
          swapRow(row, rows.indexOf(row))
        }
      }
    }
  }

  function addDraggableRow(target) {
    dragRow = target.cloneNode(true);
    dragRow.style.position = 'absolute';
    dragRow.style.width = '100%';

    // Set custom style properties.
    dragRow.style.zIndex = opts.style.zIndex;
    dragRow.style.fontSize = opts.style.fontSize;
    dragRow.style.textIndent = opts.style.textIndent;
    dragRow.style.cursor = opts.style.cursor;
    dragRow.style.boxShadow = opts.style.boxShadow;
    dragRow.style.backgroundColor = opts.style.backgroundColor;
    dragRow.style.color = opts.style.textColor;

    dragRow.style.height = getComputedStyle(target)['height'];

    let cols = Array.from(target.children);
    for(let col of cols) {
      let newCol = dragRow.children[cols.indexOf(col)];
      newCol.style.width = getComputedStyle(col)['width'];
      newCol.style.height = getComputedStyle(col)['height'];
      newCol.style.padding = getComputedStyle(col)['padding'];
      newCol.style.margin = getComputedStyle(col)['margin'];
    }

    table.appendChild(dragRow);

    let pos = target.getBoundingClientRect();
    let bottom = (dragRow.getBoundingClientRect().y - pos.y) - pos.height;
    dragRow.style.bottom = `${bottom}px`;
    dragRow.style.left = "-1px";
    document.dispatchEvent(new MouseEvent('mousemove', {
      view: window,
      cancelable: true,
      bubbles: true
    }));
  }

  function applyIsDraggingStyle() {
    currRowStyle = {
      backgroundColor: getComputedStyle(currRow)['backgroundColor'],
      color: getComputedStyle(currRow)['color']
    }
    currRow.style.backgroundColor = opts.style.draggingBackgroundColor;
    currRow.style.color = opts.style.draggingTextColor;
  }

  function resetIsDraggingStyle() {
    currRow.style.backgroundColor = currRowStyle.backgroundColor;
    currRow.style.color = currRowStyle.color;
  }

  function getRows() {
    return Array.from(table.querySelectorAll('tbody tr'));
  }

  function getTargetRow(target) {
    switch (target.tagName.toLowerCase()) {
      case 'tr':
        return target;
      case 'td':
        return target.closest('tr');
      default:
        return false;
    }
  }

  function isIntersecting(min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1)
      && Math.min(min0, max0) <= Math.max(min1, max1);
  }

  init();

}
