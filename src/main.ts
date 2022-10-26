import './style.css';
import { getRatioByName, ratios } from './ratios';
import { templatesByCount, getTemplateById } from './templates';
import { initCollageDesigner } from './collage-designer';

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
  <div class="collage-designer-canvas-parent">
    <canvas id="collage-designer-canvas"></canvas>
  </div>
</div>
<div class="righty">
  <div id="templates"></div>
</div>
<div class="footy">JS (2022)</div>
</div>
`;

initCollageDesigner('collage-designer-canvas', 800, 5, templatesByCount[4][3], ratios[0]);

const ratioSelect = document.querySelector<HTMLSelectElement>('#ratio')!;
for (const ratio of ratios) {
  ratioSelect.options.add(new Option(ratio.name, ratio.name));
}

ratioSelect.addEventListener('change', () => {
  console.log(getRatioByName(ratioSelect.value));
});

previewTemplates(document.querySelector<HTMLDivElement>('#templates')!);

function previewTemplates(templatesDiv: HTMLDivElement) {
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
      elementDiv.classList.add('template-canvas-parent');
      const canvasId = `template_${template.id}`;
      elementDiv.innerHTML = `<canvas id="${canvasId}"></canvas>`;
      groupElementsDiv.appendChild(elementDiv);
      initCollageDesigner(canvasId, 50, 1, template, ratios[0], true);
    }
  }
}
