/* eslint-disable no-console */
import React, { Component, ReactElement } from 'react';
import {
  Row, Col, Form, Input, Button, Card, DatePicker, Icon,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const { MonthPicker } = DatePicker;

type Props = {
  onSubmit: (any) => void;
  form: WrappedFormUtils;
}

class CareerForm extends Component<Props> {
  id = 0;

  handleSubmit = (e) => {
    const { form, onSubmit } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  add = (): void => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    this.id += 1;
    const nextKeys = keys.concat(this.id);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  render(): ReactElement {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Row
        type="flex"
        gutter={{
          xs: 8, sm: 16, md: 24, lg: 32,
        }}
        key={k}
      >
        <Col lg={8} md={8} sm={12} xs={24}>
          <Form.Item key={`company${k}`}>
            {getFieldDecorator(`company${k}`)(<Input />)}
          </Form.Item>
        </Col>
        <Col lg={8} md={8} sm={12} xs={24}>
          <Form.Item key={`position${k}`}>
            {getFieldDecorator(`position${k}`)(<Input />)}
          </Form.Item>
        </Col>
      </Row>
    ));
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Card style={{ margin: '72px 0' }}>
            <Row
              type="flex"
              gutter={{
                xs: 8, sm: 16, md: 24, lg: 32,
              }}
            >
              <Col lg={16} md={6} sm={24} xs={24}>
                <Form.Item label="LinkedIn">
                  {getFieldDecorator('linkedIn', {
                    rules: [
                      {
                        type: 'url',
                        message: 'Please input a valid url!',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row
              type="flex"
              gutter={{
                xs: 8, sm: 16, md: 24, lg: 32,
              }}
            >
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item label="Company">
                  {getFieldDecorator('company', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your company name',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item label="Position">
                  {getFieldDecorator('position', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your position in the company',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item label="Start">
                  {getFieldDecorator('positionstartdate', {
                    rules: [{ type: 'object', required: true, message: 'Please select a month' }],
                  })(<MonthPicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row>
            {formItems}
            <Row>
              <Form.Item>
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Button type="dashed" onClick={this.add}>
                    <Icon type="plus" />
                    Add Profession
                  </Button>
                </Col>
              </Form.Item>
            </Row>
          </Card>
          <div className="steps-action">
            <Form.Item key="submit">
              <Button type="primary" htmlType="submit">
                  Next
              </Button>
            </Form.Item>
          </div>
        </Form>
      </>
    );
  }
}

const WrappedCareerForm = Form.create({ name: 'contact' })(CareerForm);

export default WrappedCareerForm;
