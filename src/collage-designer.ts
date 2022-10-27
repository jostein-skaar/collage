import { fabric } from 'fabric';
import { Ratio } from './ratios';
import { Region, Template } from './templates';

type Dimensions = {
  size: number;
  width: number;
  height: number;
  gridX: number;
  gridY: number;
  borders: number;
};

export class CollageDesigner {
  canvas: fabric.Canvas;
  haveICreatedATemplateDesigner = false;

  borderColor = '#fff';
  backgroundColor = '#fff';
  backgroundColorEditing = '#ccc';
  backgroundColorHighlight = '#333';

  template: Template;
  ratio: Ratio;
  dimensions: Dimensions;
  rects: any[] = [];
  preview = false;

  constructor(canvasId: string, size: number, borders: number, template: Template, ratio: Ratio, preview: boolean = false) {
    this.canvas = new fabric.Canvas(canvasId);

    if (preview) {
      this.canvas.hoverCursor = 'pointer';
      this.preview = true;
    }

    this.template = template;
    this.ratio = ratio;
    this.dimensions = this.calculateDimensions(size, borders, template, ratio);

    this.setCanvasSize();

    if (this.haveICreatedATemplateDesigner) {
      this.drawGrid();
    }

    this.drawRects();
  }

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

  changeRatio(newRatio: Ratio) {
    this.ratio = newRatio;
    this.dimensions = this.calculateDimensions(this.dimensions.size, this.dimensions.borders, this.template, this.ratio);
    this.canvas.clear();
    this.setCanvasSize();
    this.drawRects();
  }

  changeTemplate(newTemplate: Template) {
    this.template = newTemplate;
    this.dimensions = this.calculateDimensions(this.dimensions.size, this.dimensions.borders, this.template, this.ratio);
    this.canvas.clear();
    this.drawRects();
  }

  private setCanvasSize() {
    this.canvas.setWidth(this.dimensions.width);
    this.canvas.setHeight(this.dimensions.height);
  }

  private drawRects() {
    this.rects = [];
    for (let index in this.template.regions) {
      let region = this.template.regions[index];
      const number = this.preview ? undefined : (+index + 1).toString();
      const rect = this.createRect(region, number);
      this.rects.push(rect);
    }
  }

  private calculateDimensions(size: number, borders: number, template: Template, ratio: Ratio): Dimensions {
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
    return {
      size,
      width,
      height,
      gridX,
      gridY,
      borders,
    };
  }

  private createRect(region: Region, number: string | undefined) {
    const rect = new fabric.Rect({
      left: region.x * this.dimensions.gridX - this.dimensions.borders,
      top: region.y * this.dimensions.gridY - this.dimensions.borders,
      width: region.columns * this.dimensions.gridX,
      height: region.rows * this.dimensions.gridY,
      fill: this.backgroundColorEditing,
      stroke: this.borderColor,
      strokeWidth: this.dimensions.borders,
      selectable: false,
    });
    this.canvas.add(rect);

    if (number !== undefined) {
      var fontSize = 80;
      var fontOffset = 10;
      var fill = '#666';

      var text = new fabric.Text(number, {
        left: rect.left! + this.dimensions.borders + fontOffset * 2,
        top: rect.top! + this.dimensions.borders + fontOffset,
        fill: fill,
        fontSize: fontSize,
        selectable: false,
      });
      this.canvas.add(text);
    }

    return rect;
  }

  private drawGrid() {
    // Vertical lines.
    for (var i = 0; i < this.template.columns; i++) {
      var stroke = '#ccc';
      if (i > 0 && i % 5 === 0) {
        stroke = '#666';
      }
      this.canvas.add(
        new fabric.Line([i * this.dimensions.gridX, 0, i * this.dimensions.gridX, this.dimensions.height], {
          stroke: stroke,
          selectable: false,
        })
      );
    }

    // Horizontal lines.
    for (var i = 0; i < this.template.rows; i++) {
      var stroke = '#ccc';
      if (i > 0 && i % 5 === 0) {
        stroke = '#666';
      }
      this.canvas.add(
        new fabric.Line([0, i * this.dimensions.gridY, this.dimensions.width, i * this.dimensions.gridY], {
          stroke: stroke,
          selectable: false,
        })
      );
    }
  }
}
