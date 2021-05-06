
import React, { ReactElement } from 'react';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import ScrollParallax from 'rc-scroll-anim/lib/ScrollParallax';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Row } from 'antd';
import BannerImage from './BannerImage';

export type BannerProps = {
  className: string;
  isMobile: boolean;
}

function Callout(justify: 'space-around' | 'space-between' | 'center' | 'end' | 'start' = 'center'): ReactElement {
  return (
    <Col md={12} xs={24}>
      <Row type="flex" justify={justify}>
        <p className="callout">
          <a href="#subscribe-title">
            <Button type="danger" size="large">JOIN</Button>
          </a>
        </p>
      </Row>
    </Col>
  );
}

export default function Banner({ className, isMobile }: BannerProps): ReactElement {
  const loop = {
    duration: 3000,
    yoyo: true,
    repeat: -1,
  };
  return (
    <div className="home-page-wrapper banner-wrapper" id="banner">
      <div className="translucent-wrapper">
        <div className="banner-background" />
      </div>
      <header id="header">
        <a id="logo" href="/">
          <img alt="logo" src="/ipa-logo.png" />
        </a>
      </header>
      <div className="banner-bg-wrapper">
        <svg width="400px" height="576px" viewBox="0 0 400 576" fill="none">
          <TweenOne component="g" animation={[{ opacity: 0, type: 'from' }, { ...loop, y: 15 }]}>
            <ellipse id="Oval-9-Copy-4" cx="100" cy="100" rx="6" ry="6" stroke="#2F54EB" strokeWidth="1.6" />
          </TweenOne>
          <TweenOne component="g" animation={[{ opacity: 0, type: 'from' }, { ...loop, y: -15 }]}>
            <g transform="translate(200 400)">
              <g style={{ transformOrigin: '50% 50%', transform: 'rotate(-340deg)' }}>
                <rect stroke="#FADB14" strokeWidth="1.6" width="9" height="9" />
              </g>
            </g>
          </TweenOne>
        </svg>
        <ScrollParallax location="banner" className="banner-bg" animation={{ playScale: [1, 1.5], rotate: 0 }} />
      </div>
      <QueueAnim className={`${className} page`} type="alpha" delay={150}>
        {isMobile && (
          <Row className="img-wrapper" key="image" type="flex" justify="center">
            <Col md={12} xs={24}>
              <BannerImage />
            </Col>
            {Callout('start')}
          </Row>
        )}
        <QueueAnim
          className="text-wrapper"
          key="text"
          type="bottom"
        >
          <p className="subtitle" key="p">
            <FormattedMessage id="app.home.introduce" />
          </p>
        </QueueAnim>
        {!isMobile && (
          <Row className="img-wrapper" key="image" type="flex" align="middle">
            <Col md={12} xs={24}>
              <ScrollParallax location="banner" component={BannerImage} animation={{ playScale: [1, 1.5], y: 80 }} />
            </Col>
            {Callout()}
          </Row>
        )}
      </QueueAnim>
    </div>
  );
}
