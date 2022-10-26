import { fabric } from 'fabric';
import { Ratio } from './ratios';
import { Region, Template } from './templates';

const haveICreatedATemplateDesigner = false;

const borderColor = '#fff';
const backgroundColor = '#fff';
const backgroundColorEditing = '#ccc';
const backgroundColorHighlight = '#333';

// canvas.clear();
// const rect2 = new fabric.Rect({ width: 50, height: 150, fill: '#77f', top: 200, left: 200 });
// // rect2.lockRotation = true;
// rect2.controls = {
//   ...fabric.Text.prototype.controls,
//   mtr: new fabric.Control({ visible: false }),
//   mb: new fabric.Control({ visible: false }),
//   mt: new fabric.Control({ visible: false }),
//   ml: new fabric.Control({ visible: false }),
//   mr: new fabric.Control({ visible: false }),
// };
// canvas.add(rect2);

export function initCollageDesigner(
  canvasId: string,
  size: number,
  borders: number,
  template: Template,
  ratio: Ratio,
  preview: boolean = false
) {
  const canvas = new fabric.Canvas(canvasId);

  const isPortrait = ratio.height > ratio.width;
  const isLandscape = ratio.height < ratio.width;

  let width = size;
  let height = size;
  if (isPortrait) {
    width = Math.floor((height / ratio.height) * ratio.width);
  } else if (isLandscape) {
    height = Math.floor((width / ratio.width) * ratio.height);
  }

  const gridX = (width + borders) / template.columns;
  const gridY = (height + borders) / template.rows;

  canvas.setWidth(width);
  canvas.setHeight(height);

  if (haveICreatedATemplateDesigner) {
    drawGrid(canvas, gridX, gridY, width, height, template);
  }

  const rects = [];
  for (let index in template.regions) {
    let region = template.regions[index];
    const number = preview ? undefined : (+index + 1).toString();
    const rect = createRect(canvas, gridX, gridY, borders, region, number);
    rects.push(rect);
  }
}

function createRect(canvas: fabric.Canvas, gridX: number, gridY: number, borders: number, region: Region, number: string | undefined) {
  const rect = new fabric.Rect({
    left: region.x * gridX - borders,
    top: region.y * gridY - borders,
    width: region.columns * gridX,
    height: region.rows * gridY,
    fill: backgroundColorEditing,
    stroke: borderColor,
    strokeWidth: borders,
    selectable: false,
  });
  canvas.add(rect);

  if (number !== undefined) {
    var fontSize = 80;
    var fontOffset = 10;
    var fill = '#666';

    var text = new fabric.Text(number, {
      left: rect.left! + borders + fontOffset * 2,
      top: rect.top! + borders + fontOffset,
      fill: fill,
      fontSize: fontSize,
      selectable: false,
    });
    canvas.add(text);
  }

  return rect;
}

function drawGrid(canvas: fabric.Canvas, gridX: number, gridY: number, width: number, height: number, template: Template) {
  // Vertical lines.
  for (var i = 0; i < template.columns; i++) {
    var stroke = '#ccc';
    if (i > 0 && i % 5 === 0) {
      stroke = '#666';
    }
    canvas.add(new fabric.Line([i * gridX, 0, i * gridX, height], { stroke: stroke, selectable: false }));
  }

  // Horizontal lines.
  for (var i = 0; i < template.rows; i++) {
    var stroke = '#ccc';
    if (i > 0 && i % 5 === 0) {
      stroke = '#666';
    }
    canvas.add(new fabric.Line([0, i * gridY, width, i * gridY], { stroke: stroke, selectable: false }));
  }
}
