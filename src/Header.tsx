import React, { ReactElement } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header(props: any): ReactElement {
  return (
    <header {...props} id="header">
      <a id="logo" href="/">
        <img alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
        <img alt="Ant Design" src="https://gw.alipayobjects.com/zos/rmsportal/DkKNubTaaVsKURhcVGkh.svg" />
      </a>
    </header>
  );
}
