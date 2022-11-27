export default class Draggable {

  constructor(ref, opts) {
    this.table = typeof ref === 'string'
      ? document.getElementById(ref).querySelector('table')
      : ref;
    this.opts = {
      ...{
        draggingClass: 'is-dragging',
        onDrop: () => {},
        onDragStart: () => {}
      },
      ...opts
    };
    this.activeRow = false;
  }

  assignRowIds() {
    for(let [,row] of Object.entries(this.rows)) {
      // Add a unique identifier to the row.
      row._uuid = Math.random().toString(16).slice(2);
    }
  }

  setTableRows(rows) {
    this.rows = rows;
    this.assignRowIds();
  }

  setActive(uuid) {
    this.activeRow = this.rows.find(row => row._uuid === uuid);
    this.activeRow.dragClass = this.opts.draggingClass;
    this.opts.onDragStart(this.activeRow);
  }

  drag(event) {
    if(!this.activeRow) {
      return false;
    }

    const dragKey = Object.keys(this.rows).find(key => this.rows[key]._uuid === this.activeRow._uuid);
    for(const[index, row] of Object.entries(this.rows)) {
      const rowEl = this.table.querySelector(`tr[uuid="${row._uuid}"]`);
      if(row._uuid !== this.activeRow._uuid && this.isIntersecting(event, rowEl)) {
        this.rows.splice(index, 0, this.rows.splice(dragKey, 1)[0]);
        break;
      }
    }
  }

  drop() {
    // Reset
    this.opts.onDrop(this.activeRow);
    delete this.activeRow.dragClass;
    this.activeRow = false;
  }

  isIntersecting(source, target) {
    const targetPos = target.getBoundingClientRect();
    return source.clientX >= targetPos.left && source.clientX <= targetPos.right
    && source.clientY >= targetPos.top && source.clientY <= targetPos.bottom
  }

}