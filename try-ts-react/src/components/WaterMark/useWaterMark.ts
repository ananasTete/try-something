import { useEffect, useRef, useState } from 'react';
import { WaterMarkProps } from './WaterMark';
import { isNumber, merge } from 'lodash-es';

type WaterMarkOptions = Omit<WaterMarkProps, 'children'>;

function toNumber(value?: string | number, defaultValue?: number) {
  if (!value) return defaultValue;
  if (isNumber(value)) return value;
  const numberVal = parseFloat(value);
  return isNumber(numberVal) ? numberVal : defaultValue;
}

const defaultOptions = {
  // 为什么其他 prop 不需要默认值？
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: '16px',
    color: 'rgba(0, 0, 0, 0.15)',
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
  },
  getContainer: () => document.body,
};

// 将用户传入的参数和默认参数合并
const getMergedOptions = (o: Partial<WaterMarkOptions>) => {
  const options = o || {};

  const mergeOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle }, // 为什么这里要先解构 defaultOptions.fontStyle？避免默认值覆盖用户传入的值。
    width: toNumber(options.width, options.image ? defaultOptions.width : undefined), // toNumber 将第一个参数转为 Number,失败则返回第二个参数
    height: toNumber(options.height, undefined),
    gap: [toNumber(options.gap?.[0], defaultOptions.gap[0]), toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1])],
  } as Required<WaterMarkOptions>; // Required 将可选参数全部转为必须参数。为什么要这样定义？因为操作之后所有参数就一定都存在，不需要再判断是否存在。

  // 对于 width,设置了就用，没设置如果是图片就用默认值，文字就是 undefined,因为之后会根据文字内容计算宽高
  // 对于高度，设置了就用，没设置就是 undefined，因为之后图片的高度会根据宽度和图片的原始高宽比计算，文字的高度会根据内容计算

  const mergedOffsetX = toNumber(mergeOptions.offset?.[0], 0)!;
  const mergedOffsetY = toNumber(mergeOptions.offset?.[1] || mergeOptions.offset?.[0], 0)!;

  mergeOptions.offset = [mergedOffsetX, mergedOffsetY];

  return mergeOptions;
};

const measureTextSize = (ctx: CanvasRenderingContext2D, content: string[], rotate: number) => {
  let width = 0;
  let height = 0;

  const lineSize: Array<{ width: number; height: number }> = [];

  content.forEach((item) => {
    const { width: textWidth, fontBoundingBoxAscent, fontBoundingBoxDescent } = ctx.measureText(item); // 获取文字的宽度，文字基线以上的最大高度，文字基线以下的最大高度

    const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent; // 加起来就是文字的行高

    if (textWidth > width) width = textWidth; // 一轮遍历下来，width 将是最大的宽度

    height += textHeight; // ？？

    lineSize.push({ width: textWidth, height: textHeight }); // 将每一个字符的宽度和高度保存起来。
  });

  const angle = (rotate * Math.PI) / 180; // 角度转弧度

  return {
    originWidth: width, // 原始宽高
    originHeight: height,
    width: Math.ceil(Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)), // 旋转后的宽高
    height: Math.ceil(Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle))),
    lineSize,
  };
};

const getCanvasData = async (options: Required<WaterMarkOptions>): Promise<{ width: number; height: number; base64Url: string }> => {
  const { rotate, image, content, fontStyle, gap } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const ratio = window.devicePixelRatio; // 设备像素比：物理像素 / CSS像素，通常值为2

  // 根据绘制内容的宽高来来初始化画布宽高，及旋转。
  const configCanvas = (size: { width: number; height: number }) => {
    const canvasWidth = size.width + gap[0]; // 设置宽度为内容宽度加上间距
    const canvasHeight = size.height + gap[1];

    canvas.style.width = `${canvasWidth}px`; // 设置 canvas 的 CSS 宽高
    canvas.style.height = `${canvasHeight}px`;

    canvas.setAttribute('width', `${canvasWidth * ratio}px`); // 设置 canvas 绘制内容宽高，这里乘以 ratio，此时绘制内容的宽度为实际显示宽度的两倍
    canvas.setAttribute('height', `${canvasHeight * ratio}px`);

    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2); // 设置原点，默认为 (0,0)，不是从这个点开始绘制，而是对其他绘制操作进行了平移

    ctx.scale(ratio, ratio); // 缩放 canvas，这里缩放了两倍。

    const RotateAngle = (rotate * Math.PI) / 180;
    ctx.rotate(RotateAngle); // 从原点开始旋转画布
  };

  const drawText = () => {
    const { fontSize, fontFamily, fontWeight, color } = fontStyle;

    const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize; // 为什么要这样写？

    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`; // 设置字体样式

    const measureSize = measureTextSize(ctx, [...content], rotate);

    const width = options.width || measureSize.width;
    const height = options.height || measureSize.height;

    configCanvas({ width, height });

    ctx.fillStyle = color!; // 设置填充颜色
    ctx.textBaseline = 'top'; // 设置文本基线
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`; // 为什么这里又要设置一遍呢？

    [...content].forEach((item, index) => {
      const { width: lineWidth, height: lineHeight } = measureSize.lineSize[index]; // 那你直接命名 lineWidth 和 lineHeight 不就好了吗？

      const xStartPoint = -lineWidth / 2; // 文字的起始点
      const yStartPoint = -(options.height || measureSize.originHeight) / 2 + lineHeight * index; // ??

      ctx.fillText(item, xStartPoint, yStartPoint, options.width || measureSize.originWidth); // 绘制文字
    });

    return Promise.resolve({ width, height, base64Url: canvas.toDataURL() });
  };

  const drawImage = () => {
    return new Promise<{ width: number; height: number; base64Url: string }>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // 干什么的？
      img.referrerPolicy = 'no-referrer';

      img.src = image;

      img.onload = () => {
        let { width, height } = options;
        if (!width || !height) {
          if (width) {
            height = (img.height / img.width) * +width; // 图片的原始高宽比 * 宽度来计算高度。 +width 将 width 转为 Number
          } else {
            width = (img.width / img.height) * +height;
          }
        }

        configCanvas({ width, height });

        ctx.drawImage(img, -width / 2, -height / 2, width, height); // 绘制图片，参数分别为图片对象，x，y，宽度，高度。这里使用负数是因为 configCanvas 中改变了原点位置。并且根据自身的宽高而不是宽高+gap能将图片不绘制在中心。

        return resolve({ width, height, base64Url: canvas.toDataURL() });
      };

      img.onerror = () => {
        return drawText();
      };
    });
  };

  return image ? drawImage() : drawText();
};

export default function useWaterMark(params: WaterMarkOptions) {
  const [options, setOptions] = useState<WaterMarkOptions>(params || {}); // 为什么不直接使用 params？

  const mergedOptions = getMergedOptions(options);

  const watermarkDiv = useRef<HTMLDivElement>();

  const container = mergedOptions.getContainer();

  const { zIndex, gap } = mergedOptions;

  function drawWaterMark() {
    if (!container) return;

    getCanvasData(mergedOptions).then(({ width, height, base64Url }) => {});
  }

  useEffect(() => {
    drawWaterMark();
  }, [options]);

  return {
    generateWaterMark: (newOptions: Partial<WaterMarkOptions>) => {
      setOptions(merge({}, options, newOptions));
    },
    destroy: () => {},
  };
}
