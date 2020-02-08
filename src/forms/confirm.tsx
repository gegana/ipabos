/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-console */
import React, { Component, ReactElement } from 'react';
import {
  Form, Button, Card, Checkbox,
} from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';
import { WrappedFormUtils } from 'antd/lib/form/Form';


type Props = {
  onSubmit: (any) => void;
  form: WrappedFormUtils;
}

type State = {
  isCaptchaValid: boolean;
  captchaToken: string;
}


class ConfirmForm extends Component<Props, State> {
  recaptchaRef = React.createRef();

  state: State;

  constructor(props) {
    super(props);
    this.state = {
      isCaptchaValid: false,
      captchaToken: '',
    };
  }

  handleSubmit = (e) => {
    const { form, onSubmit } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const { isCaptchaValid, captchaToken } = this.state;
      if (!err && isCaptchaValid) {
        onSubmit({ ...values, captchaToken });
      }
    });
  };

  verifyRecaptchaCallback = (token) => {
    if (token) {
      this.setState({
        isCaptchaValid: true,
        captchaToken: token,
      });
    } else {
      this.setState({
        isCaptchaValid: false,
        captchaToken: '',
      });
      // @ts-ignore: Unreachable code error
      this.recaptchaRef.current.reset();
    }
  };

  render(): ReactElement {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Card style={{ margin: '72px 0' }}>
            <Form.Item>
              {getFieldDecorator('agreement', {
                valuePropName: 'agreement',
                rules: [
                  {
                    required: true,
                    message: 'Please agree to the terms and conditions',
                  },
                  {
                    validator: (r, v, c) => {
                      if (!v) {
                        c('Please agree to the terms and conditions');
                      } else {
                        c();
                      }
                    },
                  },
                ],
              })(
                <Checkbox>
                      I understand that by submitting this form I will receive emails
                      from the Indonesian Professional Association (IPA).
                </Checkbox>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('whatsapp')(
                <Checkbox>
                      I want to participate in the WhatsAppGroup.
                </Checkbox>,
              )}
            </Form.Item>
            <ReCAPTCHA
              ref={this.recaptchaRef}
              sitekey="6LfWyqcUAAAAAHAHZBQBHTK3_siyqeoQicDcE6YR"
              onChange={this.verifyRecaptchaCallback}
            />
          </Card>
          <div className="steps-action">
            <Form.Item key="submit">
              <Button type="primary" htmlType="submit">
                  Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </>
    );
  }
}

const WrappedConfirmForm = Form.create({ name: 'contact' })(ConfirmForm);

export default WrappedConfirmForm;
