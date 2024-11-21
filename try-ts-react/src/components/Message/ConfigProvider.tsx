import MessageProvider, { MessageRef } from './Message.tsx';
import { createContext, FC, PropsWithChildren, useRef } from 'react';

interface ConfigProviderProps {
  messageRef?: React.RefObject<MessageRef>;
}

export const ConfigContext = createContext<ConfigProviderProps>({});

export const ConfigProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const messageRef = useRef<MessageRef>(null);

  return (
    <ConfigContext.Provider value={{ messageRef }}>
      <MessageProvider ref={messageRef} />
      {children}
    </ConfigContext.Provider>
  );
};
