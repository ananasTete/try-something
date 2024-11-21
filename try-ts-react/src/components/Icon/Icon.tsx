import { CSSProperties, forwardRef, SVGAttributes } from 'react';
import './index.less';
import classNames from 'classnames';

/**
 * 因为 Icon 组件就是对 svg 的封装，所以我们也接受所有 svg 的属性，透传给内部的 svg。所以 Icon 组件的参数类型就是自定义参数和 svg 参数的交集。
 *
 * 为什么要用 ref? 当我们想给组件设置 ref 时，我们需要的是给内部的 svg 设置 ref，而不是 Icon 组件。
 */

interface BaseIconProps {
  style?: CSSProperties;
  className?: string;
  size?: string | [string, string];
  spin?: boolean;
  viewBox?: string;
}

export type IconProps = BaseIconProps & Omit<SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const getSize = (size: BaseIconProps['size']) => {
  if (Array.isArray(size) && size.length === 2) {
    return size as [string, string];
  }

  const width = size as string | '1rem';
  const height = size as string | '1rem';

  return [width, height];
};

const Icon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  const { style, className, size = '1rem', spin, viewBox = '0 0 1024 1024', children, ...rest } = props;

  const [width, height] = getSize(size);

  const classname = classNames('icon', { 'icon-spin': spin }, className);

  return (
    <svg ref={ref} style={style} className={classname} viewBox={viewBox} width={width} height={height} {...rest}>
      {children}
    </svg>
  );
});

export default Icon;
