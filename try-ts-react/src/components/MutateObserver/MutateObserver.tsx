import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import useMutateObserver from './useMutateObserver';

interface MutateObserverProps extends React.PropsWithChildren {
  options?: MutationObserverInit;
  onMute?: MutationCallback;
}

const MutateObserver: FC<MutateObserverProps> = (props) => {
  const { options, onMute = () => {}, children } = props;

  const elementRef = useRef<HTMLElement>(null);

  const [target, setTarget] = useState<HTMLElement>();

  useMutateObserver(target!, onMute, options);

  useLayoutEffect(() => {
    setTarget(elementRef.current!);
  }, []);

  if (!children) return null;

  return React.cloneElement(children, { ref: elementRef });
};

export default MutateObserver;
