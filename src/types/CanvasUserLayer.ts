import { CanvasLayer } from "./CanvasLayer";
import { EffectFilter } from "./EffectFilter";
import { PresetFilter } from "./PresetFilter";

export interface CanvasUserLayer extends CanvasLayer {
  dominantColorLightness: number;
  effectFilter: EffectFilter | null;
  presetFilter: PresetFilter | null;
  croppedX: number;
  croppedY: number;
  croppedWidth: number;
  croppedHeight: number;
  croppedAngle: number;
  croppedScale: number;
  croppedImageX: number;
  croppedImageY: number;
  // ToDo: あとで整理して削除する
  cropper: {
    cropperWidth: number;
    cropperHeight: number;
    cropperX: number;
    cropperY: number;
    imageX: number;
    imageY: number;
    imageAngle: number;
    imageScale: number;
    cropperScale: number;
    cropperScaleX: number;
    cropperScaleY: number;
  };
  blur: number;
  hue: number;
  saturate: number;
}
