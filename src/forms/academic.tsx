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

class AcademicForm extends Component<Props> {
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
          <Form.Item key={`school${k}`}>
            {getFieldDecorator(`school${k}`)(<Input />)}
          </Form.Item>
        </Col>
        <Col lg={8} md={8} sm={12} xs={24}>
          <Form.Item key={`degree${k}`}>
            {getFieldDecorator(`degree${k}`)(<Input />)}
          </Form.Item>
        </Col>
        <Col lg={8} md={8} sm={12} xs={24}>
          <Form.Item key={`year${k}`}>
            {getFieldDecorator(`schoolyear${k}`)(<MonthPicker style={{ width: '100%' }} />)}
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
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item label="School">
                  {getFieldDecorator('school', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your school name',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item label="Degree">
                  {getFieldDecorator('degree', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your earned degree',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item label="Year Graduated">
                  {getFieldDecorator('schoolyear', {
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
                    Add Degree
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

const WrappedAcademicForm = Form.create({ name: 'contact' })(AcademicForm);

export default WrappedAcademicForm;
