/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable react/prefer-stateless-function */
import React, { ReactElement, useState, useEffect } from 'react';
import Axios from 'axios';
import {
  Steps, Row, Col, message,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import ContactForm from './forms/contact';
import CareerForm from './forms/career';
import AcademicForm from './forms/academic';
import ConfirmForm from './forms/confirm';

const { Step } = Steps;

const steps = [
  {
    title: 'Contact',
    content: 'First-content',
  },
  {
    title: 'Professional Bio',
    content: 'Second-content',
  },
  {
    title: 'Academic Bio',
    content: 'Last-content',
  },
  {
    title: 'Finalize',
    content: 'Last-content',
  },
];

function renderForm(current: number, onSubmit: (any) => void): ReactElement {
  switch (current) {
    case 0:
      // @ts-ignore: Unreachable code error
      return <ContactForm onSubmit={onSubmit} />;
    case 1:
      // @ts-ignore: Unreachable code error
      return <CareerForm onSubmit={onSubmit} />;
    case 2:
      // @ts-ignore: Unreachable code error
      return <AcademicForm onSubmit={onSubmit} />;
    case 3:
    default:
      // @ts-ignore: Unreachable code error
      return <ConfirmForm onSubmit={onSubmit} />;
  }
}

export default function Page2(): ReactElement {
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState({});
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const onSubmit = (values) => {
    setData((prev) => ({ ...prev, ...values }));
    setCurrent((prev) => prev + 1);
  };
  useEffect(() => {
    if (current > 3) {
      Axios.post('/contacts', data).then(() => {
        setDisplayConfirmation(true);
        message.success('Thank you for choosing to subscribe to our network! We will review your submission shortly.');
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [data, current]);
  return (
    displayConfirmation ? null : (
      <div className="home-page-wrapper page2">
        <Row className="page" type="flex" align="middle" justify="center">
          <h2 style={{ margin: '100px 0 0 0', color: 'rgba(0, 0, 0, 0.85)' }}><FormattedMessage id="app.home.solution" /></h2>
        </Row>
        <Row
          type="flex"
          align="middle"
          justify="center"
          style={{ minHeight: '900px', margin: '24px' }}
          id="page2"
        >
          <Col xl={16} lg={18} md={20} xs={24}>
            <Steps current={current} style={{ margin: '12px 0' }}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            { renderForm(current, onSubmit) }
          </Col>
        </Row>
      </div>
    )
  );
}
