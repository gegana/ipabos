import React, { ReactElement, useState, useEffect } from 'react';
import DocumentTitle from 'react-document-title';
import { IntlProvider } from 'react-intl';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import Banner from './Banner';
import lang from './lang/en-US';
import './static/style';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Footer from './Footer';

export interface HomeState {
  locale: string;
  isMobile: boolean;
}

export default function Home(): ReactElement {
  const [state, setState] = useState<HomeState>({
    locale: 'en-US',
    isMobile: false,
  });

  useEffect(() => {
    const enquireScreenHandler = enquireScreen(
      (b): void => {
        if (b !== state.isMobile) {
          setState((prev) => ({ ...prev, isMobile: b }));
        }
      },
    );
    return (): void => {
      unenquireScreen(enquireScreenHandler);
    };
  }, [state]);

  return (
    <IntlProvider locale={state.locale} messages={lang}>
      <div className="page-wrapper home">
        <Banner className="home-banner" isMobile={state.isMobile} />
        <Page1 isMobile={state.isMobile} />
        <Page2 />
        <Page3 />
        <Footer />
        <DocumentTitle title="Subscribe" key="title" />
      </div>
    </IntlProvider>
  );
}
