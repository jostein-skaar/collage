import { setupCounter } from './counter';
import { fabric } from 'fabric';
import './style.css';
import { getRatioByName, ratios } from './ratios';
import { Region, templatesByCount } from './templates';

const dimension = 800;
const bordersRef800 = 5;
let ratio = ratios[0];
let template = templatesByCount[4][3];
const haveICreatedATemplateDesigner = false;
let rects = [];

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="content">
<div class="heady">
  <h1>Collage creator</h1>
  <div class="tool-bar">
    <button>New</button>
    <button>Save</button>
    <select id="ratio"></select>
  </div>
</div>
<div class="lefty">Images: Need to inject them somehow (or request them)</div>
<div class="main">
  <div class="canvas-parent">
    <canvas id="canvas"></canvas>
  </div>
</div>
<div class="righty">
  <div id="templates"></div>
</div>
<div class="footy">JS (2022)</div>
</div>
`;

const canvas = new fabric.Canvas('canvas');
const rect = new fabric.Rect({
  top: 100,
  left: 100,
  width: 60,
  height: 70,
  fill: 'red',
});
canvas.add(rect);

const rect2 = new fabric.Rect({ width: 50, height: 150, fill: '#77f', top: 200, left: 200 });
// rect2.lockRotation = true;
rect2.controls = {
  ...fabric.Text.prototype.controls,
  mtr: new fabric.Control({ visible: false }),
  mb: new fabric.Control({ visible: false }),
  mt: new fabric.Control({ visible: false }),
  ml: new fabric.Control({ visible: false }),
  mr: new fabric.Control({ visible: false }),
};
canvas.add(rect2);

canvas.clear();
const widthWanted = dimension;
const heightWanted = Math.floor((widthWanted / ratio.width) * ratio.height);
const borders = (dimension / 800) * bordersRef800;
const widthWithBorders = widthWanted + borders * 2;
const heightWithBorders = heightWanted + borders * 2;
const gridX = (widthWanted + borders) / template.columns;
const gridY = (heightWanted + borders) / template.rows;

if (haveICreatedATemplateDesigner) {
  drawGrid();
}

for (let i in template.regions) {
  let r = template.regions[i];
  createRect(r, +i);
}

function drawGrid() {
  // Vertical lines.
  for (var i = 0; i < template.columns; i++) {
    var stroke = '#ccc';
    if (i > 0 && i % 5 === 0) {
      stroke = '#666';
    }
    canvas.add(new fabric.Line([i * gridX, 0, i * gridX, heightWithBorders], { stroke: stroke, selectable: false }));
  }

  // Horizontal lines.
  for (var i = 0; i < template.rows; i++) {
    var stroke = '#ccc';
    if (i > 0 && i % 5 === 0) {
      stroke = '#666';
    }
    canvas.add(new fabric.Line([0, i * gridY, widthWithBorders, i * gridY], { stroke: stroke, selectable: false }));
  }
}

function createRect(region: Region, index: number) {
  const borderColor = '#fff';
  const backgroundColor = '#fff';
  const backgroundColorEditing = '#ccc';
  const backgroundColorHighlight = '#333';

  const r = new fabric.Rect({
    left: region.x * gridX,
    top: region.y * gridY,
    width: region.columns * gridX,
    height: region.rows * gridY,
    fill: backgroundColorEditing,
    stroke: borderColor,
    strokeWidth: borders,
    selectable: true,
  });
  rects.push(r);
  canvas.add(r);

  var fontSize = 80;
  var fontOffset = 10;
  var fill = '#666';

  var t = new fabric.Text((index + 1).toString(), {
    left: r.left! + borders + fontOffset * 2,
    top: r.top! + borders + fontOffset,
    fill: fill,
    fontSize: fontSize,
    selectable: false,
  });
  canvas.add(t);

  return r;
}

function createRectRed(region: Region) {
  var r = new fabric.Rect({
    left: region.x * gridX,
    top: region.y * gridY,
    width: region.columns * gridX,
    height: region.rows * gridY,
    opacity: 0.7,
    fill: '#faa',
    stroke: 'red',
    selectable: false,
  });
  // r.setControlsVisibility({ mtr: false });
  canvas.add(r);
  return r;
}

canvas.setWidth(widthWithBorders);
canvas.setHeight(heightWithBorders);

const ratioSelect = document.querySelector<HTMLSelectElement>('#ratio')!;
for (const ratio of ratios) {
  ratioSelect.options.add(new Option(ratio.name, ratio.name));
}

// <option value="first">First Value</option>
// <option value="second" selected>Second Value</option>
// <option value="third">Third Value</option>

console.log(ratioSelect.value);

ratioSelect.addEventListener('change', () => {
  console.log(getRatioByName(ratioSelect.value));
});
// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

const templatesDiv = document.querySelector<HTMLDivElement>('#templates')!;

for (const key in templatesByCount) {
  const templates = templatesByCount[+key];
  const groupDiv = document.createElement('div');
  groupDiv.classList.add('template-group');
  const groupHeader = document.createElement('h2');
  groupHeader.innerText = `${key} images`;
  groupDiv.appendChild(groupHeader);
  const groupElementsDiv = document.createElement('div');
  groupElementsDiv.classList.add('template-container');
  templatesDiv.appendChild(groupDiv);
  groupDiv.appendChild(groupElementsDiv);

  for (const template of templates) {
    const elementDiv = document.createElement('div');
    elementDiv.innerHTML = `<b>${template.id}</b>`;
    groupElementsDiv.appendChild(elementDiv);
  }
}
