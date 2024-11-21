import { useCallback, useEffect, useRef } from 'react';
import useWaterMark from './useWaterMark';

export interface WaterMarkProps extends React.PropsWithChildren {
  style?: React.CSSProperties;
  className?: string;
  width?: number;
  height?: number;
  rotate?: number;
  zIndex?: string | number; // 为什么要 string
  gap?: [number, number];
  offset?: [number, number];
  image?: string;
  content?: string | string[];
  fontStyle?: {
    fontSize?: string;
    color?: string;
    fontFamily?: string;
    fontWeight?: string;
  };
  getContainer?: () => HTMLElement;
}

const WaterMark: React.FC<WaterMarkProps> = (props) => {
  const { style, className, width, height, rotate, zIndex, gap, offset, image, content, fontStyle, children } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  // 因为还要作为 useEffect 的依赖，所以使用 useCallback
  const getContainer = useCallback(() => {
    return props.getContainer ? props.getContainer() : containerRef.current!;
  }, [containerRef.current, props.getContainer]);

  // 通过 useWaterMark 返回的 generate 方法生成水印
  const { generateWaterMark } = useWaterMark({ width, height, rotate, zIndex, gap, offset, image, content, fontStyle, getContainer });

  useEffect(() => {
    generateWaterMark({
      width,
      height,
      rotate,
      zIndex,
      gap,
      offset,
      image,
      content,
      fontStyle,
      getContainer,
    });
  }, [width, height, rotate, zIndex, JSON.stringify(gap), JSON.stringify(offset), image, content, JSON.stringify(fontStyle), getContainer]);

  return children ? (
    <div style={style} className={className} ref={containerRef}>
      {children}
    </div>
  ) : null;
};

export default WaterMark;
