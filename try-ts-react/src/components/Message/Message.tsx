import { CSSProperties, FC, forwardRef, ReactNode, useMemo } from 'react';
import useStore from './useStore.ts';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.less';
import { createPortal } from 'react-dom';
import useTimer from './useTimer.ts';

export type Position = 'top' | 'bottom';

export interface MessageProps {
  style?: CSSProperties;
  className?: string | string[];
  content: ReactNode | string;
  duration?: number;
  id?: number;
  position?: Position;
  onClose?: (...args: any) => void;
}

export interface MessageRef {
  add: (message: MessageProps) => number;
  remove: (id: number) => void;
  update: (id: number, message: MessageProps) => void;
  clear: () => void;
}

const MessageItem: FC<MessageProps> = (message) => {
  const { duration } = message;
  const { onMouseEnter, onMouseLeave } = useTimer({ id: message.id!, duration, remove: message.onClose! });

  return (
    <div className="message-item" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {message.content}
    </div>
  );
};

const MessageProvider = forwardRef<MessageRef, {}>((_, ref) => {
  const { messageList, add, remove, update, clear } = useStore();

  // 只要在 useStore 接受的 direction 只有一个，不能在 add 方法时传入，那为什么 messageList 中保存了两个方向的消息呢？？？

  // useImperativeHandle(ref, () => ({add, update, remove, clear}), [])

  // 为什么这里不用 useImperativeHandle 呢？？？
  // 因为在 ConfigProvider 中把 messageRef 传给了 Context 和本组件，但 useImperativeHandle 为 ref 赋值不是同步的，所以在 ConfigProvider 的 children 中获取 Context 的值时，
  // 会出现 ref.current 为 null 的情况，所以这里直接赋值。

  if ('current' in ref!) {
    ref.current = { add, update, remove, clear };
  }

  const positions = Object.keys(messageList) as Position[];

  const messageWrapper = (
    <div className="message-wrapper">
      {positions.map((direction) => {
        return (
          <TransitionGroup key={direction} className={`message-wrapper-${direction}`}>
            {messageList[direction].map((message) => {
              return (
                <CSSTransition key={message.id} timeout={1000} classNames="message">
                  <MessageItem onClose={remove} {...message} />
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        );
      })}
    </div>
  );

  // 为什么要吧它挂载到 div#app 外面呢？？？

  const el = useMemo(() => {
    const el = document.createElement('div');
    el.className = 'wrapper';

    document.body.appendChild(el);
    return el;
  }, []);

  return createPortal(messageWrapper, el);
});

export default MessageProvider;
