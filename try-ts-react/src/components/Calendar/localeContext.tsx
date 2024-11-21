import { createContext } from 'react';

export interface ILocaleContext {
  locale: string;
}

const localeContext = createContext<ILocaleContext>({
  locale: 'en-US',
});

export default localeContext;
