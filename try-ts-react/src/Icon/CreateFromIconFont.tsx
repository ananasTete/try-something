import Icon, {IconProps} from "./Icon.tsx";
import {forwardRef} from "react";

/**
 * 接受一个 iconFont 的 url，返回一个组件。
 *
 * 为这个 url 创建一个 script 元素，并添加到 document.body 中。这样执行时就会请求 url 中指向的 svg 元素（其中包含了多个图标），并自动添加到 document.body 中。
 *
 * svg 中的 use 元素是用来复制和重用其他图形的。use 元素的 xlinkHref 属性指向新请求到的图标的 id 就能复用了。
 */

interface CreateFromIconFontOptions {
    scriptUrl: string;
    iconProps?: IconProps;
}

const loadedSet = new Set<string>();

const createFromIconFont = (options: CreateFromIconFontOptions) => {
    const {scriptUrl, iconProps = {}} = options;

    if (scriptUrl.length && !loadedSet.has(scriptUrl)) {
        const script = document.createElement('script');
        script.setAttribute('src', scriptUrl);
        script.setAttribute('data-namespace', scriptUrl);
        document.body.appendChild(script);
        loadedSet.add(scriptUrl);
    }

    return forwardRef<SVGSVGElement, IconProps>((props, ref) => <Icon ref={ref} {...iconProps} {...props}>
        {iconProps.type ? <use xlinkHref={`#${iconProps.type}`}/> : null}
    </Icon>);
}

export default createFromIconFont;