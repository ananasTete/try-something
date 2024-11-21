import { forwardRef, ReactNode } from 'react';
import Icon, { IconProps } from './Icon.tsx';

/**
 * createIcon 返回一个组件，当为其设置 ref 时，需要给内部的 Icon 组件内部的 svg 元素设置 ref，而不是组件本身。
 *
 * 为了能在调用 createIcon 和返回的组件上都能设置 IconProps，所以我们需要在 createIcon 的参数中接受 IconProps，也要在返回的函数组件中传递 IconProps。
 */

interface CreateIconOptions {
  content: ReactNode;
  iconProps?: IconProps;
}

const createIcon = (options: CreateIconOptions) => {
  const { content, iconProps = {} } = options;
  return forwardRef<SVGSVGElement, IconProps>((props, ref) => (
    <Icon ref={ref} {...iconProps} {...props}>
      {content}
    </Icon>
  ));
};

export default createIcon;
