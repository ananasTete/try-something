import { SizeType } from './Space.tsx';
import { createContext, FC, PropsWithChildren } from 'react';

/**
 * 当我想给组件的参数设置一个已存在的类型，但这个类型中不包含 children 属性而我们要用 children 属性时，
 *
 * 可以使用 PropsWithChildren 来包装这个类型。它会在给定类型的基础上返回一个包含 children 属性的类型。
 *
 * 或者自定义一个类型继承给定类型，然后添加 children 属性。见注释代码。
 */

interface ConfigContextType {
  space?: {
    size?: SizeType;
  };
}

export const ConfigContext = createContext<ConfigContextType>({});

// interface ConfigProviderProps extends ConfigContextType {
//     children?: ReactNode;
// }

const ConfigProvider: FC<PropsWithChildren<ConfigContextType>> = (props) => {
  const { space, children } = props;
  return <ConfigContext.Provider value={{ space }}>{children}</ConfigContext.Provider>;
};

export default ConfigProvider;
