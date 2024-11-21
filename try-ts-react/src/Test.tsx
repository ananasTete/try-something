import { Children, FC } from 'react';

const Test: FC<any> = ({ children }) => {
  console.log(
    999,
    Children.map(children, (child) => 1),
  );
  return <div>{children}</div>;
};

export default Test;
