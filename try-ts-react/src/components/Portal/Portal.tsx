import React, { FC, forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps extends React.PropsWithChildren {
  attach?: HTMLElement | string;
}

const Portal = forwardRef((props: PortalProps, ref) => {
  const { attach = document.body, children } = props; // 解构对象时使用 ：重命名，使用 = 设置默认值，可以使用这种方式为 props 设置默认值。

  const container = useMemo(() => {
    const el = document.createElement('div');
    el.className = 'portal-wrapper';
    return el;
  }, []);

  useEffect(() => {
    const parentElement = getAttachElement(attach);
    parentElement?.appendChild?.(container);

    return () => {
      parentElement?.removeChild?.(container);
    };
  }, [container, attach]);

  useImperativeHandle(ref, () => container);

  return createPortal(children, container);
});

export default Portal;

export function getAttachElement(attach: PortalProps['attach']) {
  if (typeof attach === 'string') {
    const parentElement = document.querySelector(attach);
    if (parentElement) {
      return parentElement;
    }
  }
  if (typeof attach === 'object' && attach instanceof HTMLElement) {
    // 判断 attach 是否是 HTMLElement 类型。
    return attach;
  }
  return document.body;
}

/**
 * 需求：
 *
 * 1. 接受一个 attach 参数，将 children 渲染到指定的 DOM 节点上。
 * 2. attach 可以是 HTMLElement 类型或者是一个用于 querySelector 的字符串。
 * 3. 为组件绑定 ref 时，能透传获取组件的 children 元素。
 *
 * 实现：
 *
 * 1. 使用 createPortal 方法将 children 渲染到指定的 DOM 节点上。
 * 1.1 为什么要这么做？ 可以将元素渲染到父组件之外的地方，如 Modal 组件、Message 组件等可以挂载到 body 上。
 *
 * 2. 定义 getAttachElement 方法，根据 attach 的类型返回对应的 HTMLElement。
 *
 * 3. 使用 forwardRef + useImperativeHandle 。
 * 3.1 这里为什么要定义一个 container 容器，而不是直接为 ref 返回 children 呢？因为 children 是一个 ReactNode 对象，我们通过 ref 想获取的是 DOM 实例。
 * 所以将 children 渲染到 container 上，然后通过 ref 返回 container 来间接获取 children。
 * 3.1.1 那为什么不直接返回被挂载的这个 parentNode 呢？
 * 3.2 就没有办法获取 children 的实例了吗？
 * 3.3 为什么要使用 useMemo 定义 container 呢？如果要其在组件多次重渲染保持不变，为什么不用 useRef ? 因为使用 useMemo 更方便。使用 useRef 更适合虽然在多次渲染保持不变，但会因为某种条件而变化的场景；
 * 而使用 useMemo （不设置依赖）适合从始至终保持不变的场景。
 */
