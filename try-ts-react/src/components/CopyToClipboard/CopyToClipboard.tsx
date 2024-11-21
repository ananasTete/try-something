import copy from 'copy-to-clipboard';
import React, { FC } from 'react';

interface CopyToClipboardProps extends React.PropsWithChildren {
  text: string;
  onCopy?: (text: string, result: boolean) => void;
  options?: {
    debug?: boolean;
    message?: string;
    format?: string;
  };
}

// const CopyToClipboard: FC<CopyToClipboardProps> = (props) => {
//   const { text, onCopy, children } = props;

//   function handleCopy() {
//     const res = copy(text);
//     if (res && onCopy) onCopy(text);
//   }

//   return <div onClick={handleCopy}>{children}</div>;
// };

const CopyToClipboard: FC<CopyToClipboardProps> = (props) => {
  const { text, onCopy, options, children } = props;

  const elem = React.Children.only(children); // 断言 children 只有一个元素。否则抛出错误

  function onClick(event: MouseEvent) {
    const res = copy(text, options);

    if (onCopy) onCopy(text, res);

    if (typeof elem?.props?.onClick === 'function') {
      elem.props.onClick(event);
    }
  }

  return React.cloneElement(elem, { onClick });
};

export default CopyToClipboard;


/**
 * 需求：传入一个元素，点击元素时将 text 复制到剪切板，并触发 onCopy 回调。
 * 
 * 自己做的：添加一个 div 包裹 children，点击 children 时通过冒泡机制触发操作将 text 复制到剪切板，并调用 onCopy 回调。
 * 
 * 实现：使用 React.cloneElement 方法复制一个元素，并添加 onClick 事件。触发复制操作，并且如果 children 有 onClick 事件，也会触发。
 */
