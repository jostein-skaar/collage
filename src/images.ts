export type Image = {
  name: string;
  url: string;
  width: number;
  height: number;
};

export type Collage = {
  id: number;
  name: string;
  ratio: string;
  templateId: number;
  images: ImageInCollage[];
};

export type ImageInCollage = {
  name: string;
  index: number;
  x: number;
  y: number;
  scale: number;
};
