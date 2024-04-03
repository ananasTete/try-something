import {useContext} from "react";
import {ConfigContext} from "./ConfigProvider.tsx";
import {MessageRef} from "./Message.tsx";

// useMessage 依赖 Context 数据，所以他必须在 ConfigProvider 组件内部使用

export function useMessage(): MessageRef {
    const {messageRef} = useContext(ConfigContext);

    if (!messageRef) throw new Error('请在最外层添加 ConfigProvider 组件');

    return messageRef.current!;
}