/* eslint-disable no-console */
import React, { Component, ReactElement } from 'react';
import {
  Row, Col, Form, Input, Select, Button, Card,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const { Option } = Select;

type Props = {
  onSubmit: (any) => void;
  form: WrappedFormUtils;
}

class ContactForm extends Component<Props> {
  handleSubmit = (e) => {
    const { form, onSubmit } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  render(): ReactElement {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const countryPrefixSelector = getFieldDecorator('countryPrefix', {
      initialValue: '1',
    })(
      <Select style={{ width: 70 }}>
        <Option value="1">+1</Option>
        <Option value="62">+62</Option>
      </Select>,
    );
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
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item label="Email" hasFeedback>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        type: 'email',
                        message: 'The input is not valid Email',
                      },
                      {
                        required: true,
                        message: 'Please input your Emai!',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item label="First Name" hasFeedback>
                  {getFieldDecorator('firstName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your first name',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item label="Last Name" hasFeedback>
                  {getFieldDecorator('lastName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your last name',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={16} md={16} sm={24} xs={24}>
                <Form.Item label="Phone Number" hasFeedback>
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: 'Please input your phone number!' }],
                  })(<Input addonBefore={countryPrefixSelector} style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
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

const WrappedContactForm = Form.create({ name: 'contact' })(ContactForm);

export default WrappedContactForm;
