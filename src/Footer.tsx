import React, { ReactElement } from 'react';
import { Row, Col } from 'antd';

function Footer(): ReactElement {
  return (
    <footer id="footer" className="dark">
      <div className="footer-wrap">
        <Row>
          <Col md={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>Source</h2>
              <div>
                <a target="_blank " href="https://github.com/gegana/ipabos">
                  GitHub
                </a>
              </div>
              <div>
                <a target="_blank " href="https://github.com/ant-design/ant-design">
                  Ant Design
                </a>
              </div>
            </div>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>Contact</h2>
              <div>
                <a href="mailto:hello@ipabos.com">hello@ipabos.com</a>
              </div>
              <div>
                <a target="_blank " href="https://www.linkedin.com/company/ipabos">LinkedIn</a>
              </div>
            </div>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>Affiliates</h2>
              <div>
                <a target="_blank " href="https://www.permiasmass.com/">
                  PERMIAS MA
                </a>
              </div>
              <div>
                <a target="_blank " href="https://www.ipanet.org/">
                  IPA NET
                </a>
              </div>
              <div>
                <a target="_blank " href="https://www.ipanet.org/sf">
                  IPA SF
                </a>
              </div>
              <div>
                <a target="_blank " href="https://www.ipanet.org/ny">
                  IPA NY
                </a>
              </div>
              <div>
                <a target="_blank " href="https://www.ipanet.org/dc">
                  IPA DC
                </a>
              </div>
              <div>
                <a target="_blank " href="https://singaporeglobalnetwork.gov.sg/">
                  Singapore Global Network
                </a>
              </div>
            </div>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>Credits</h2>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="https://unsplash.com/@osmanrana?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge">City Photo @ Osman Rana</a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="https://www.canva.com/">Vector Graphics @ Canva</a>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="bottom-bar">
        <Col md={4} sm={24} />
        <Col md={20} sm={24}>
          <span style={{ marginRight: 12 }}>
            Copyright © IPABOS
          </span>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
