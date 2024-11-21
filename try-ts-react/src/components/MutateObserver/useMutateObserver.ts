import { useEffect } from 'react';

const defaultOptions: MutationObserverInit = {
  subtree: true,
  childList: true,
  attributeFilter: ['style', 'class'],
};

function useMutateObserver(nodeOrList: HTMLElement | HTMLElement[], callback: MutationCallback, options: MutationObserverInit = defaultOptions) {
  useEffect(() => { // 因为 Observer 绑定的是 DOM 节点，所以需要在 useEffect 中执行。
    if (!nodeOrList) return;

    let instance: MutationObserver;

    const nodeList = Array.isArray(nodeOrList) ? nodeOrList : [nodeOrList];

    if ('MutationObserver' in window) {
      instance = new MutationObserver(callback);

      nodeList.forEach((element) => {
        instance.observe(element, options);
      });
    }

    return () => {
      instance?.takeRecords(); // 在组件销毁时，清除所有剩余的通知。
      instance?.disconnect(); // 在组件销毁时，断开连接，停止接收通知。
    };
  }, [nodeOrList, callback, options]);
}

export default useMutateObserver;
