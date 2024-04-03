import {CSSProperties, ReactNode, HTMLAttributes, FC, Children, useMemo, Fragment, useContext} from "react";
import './index.less';
import classNames from "classnames";
import {ConfigContext} from "./ConfigProvider.tsx";

/**
 * 这里将布局封装将组件 Space，提供方便的布局方式。并且将公共配置使用 Context API 封装成组件 ConfigProvider，方便使用。
 */

/**
 * 这里为什么要继承 HTMLAttributes<HTMLDivElement> 呢？为什么在 Icon 组件中是交叉类型呢？？
 *
 * 通过 props 中的配置动态地为 Space 组件绑定 class 来实现不同的布局。那为什么 `space-align-${mergeAlign}` 需要写为对象格式呢？？
 *
 * 对于元素的间距，由于其值不确定，不能使用动态绑定 class 的方式来实现。所以这里使用了 style 属性来实现。可以接受预定值，也可以接受数字，或者是元组（因为只能设置横纵两个方向的间距）。
 *
 * 那为什么 SizeType 接受 undefined ? 因为可以用元组，只为一个方向设置间距。如 size=[16]。
 */

const SpaceSize = {
    small: 8,
    middle: 16,
    large: 24
}

export type SizeType = 'small' | 'middle' | 'large' | number | undefined;

function getNumberSize(size: SizeType) {
    return typeof size === 'string' ? SpaceSize[size] : size || 0;
}

interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
    style?: CSSProperties;
    className?: string;
    size?: SizeType | [SizeType, SizeType];
    direction?: 'horizontal' | 'vertical';
    align?: 'start' | 'end' | 'center' | 'baseline';
    split?: ReactNode;
    wrap?: boolean;
}

const Space: FC<SpaceProps> = (props) => {

    const {space} = useContext(ConfigContext);

    const {
        style,
        className,
        size = space?.size || 'small',
        direction = 'horizontal',
        align,
        split,
        wrap,
        children,
        ...otherProps
    } = props;

    // 因为我需要使用 map 方法，所以需要将 children 转换为数组。
    const childNodes = Children.toArray(children);

    // 在横向排列下，如果没有设置 align 属性，那么默认为 center
    const mergeAlign = direction === 'horizontal' && align === undefined ? 'center' : align;

    const classname = classNames('space', `space-${direction}`, {
        [`space-align-${mergeAlign}`]: mergeAlign,
        'space-wrap': wrap
    }, className);

    const nodes = childNodes.map((child: any, i) => {
        const key = child && child.key || `space-item-${i}` // 这里 split 的的 className 属性是什么意思？？
        return <Fragment key={key}>
            <div className='space-item'>{child}</div>
            {i < childNodes.length - 1 && split && (
                <span className={`${className}-split`}>
                    {split}
                </span>
            )}
        </Fragment>
    });

    const otherStyles: CSSProperties = {};

    const [horizontalSize, verticalSize] = useMemo(() => {
        return (Array.isArray(size) ? size : [size, size]).map(item => getNumberSize(item));
    }, [size])

    otherStyles.columnGap = horizontalSize;
    otherStyles.rowGap = verticalSize;

    return <div style={{...otherStyles, ...style}} className={classname} {...otherProps}>{nodes}</div>
}

export default Space;