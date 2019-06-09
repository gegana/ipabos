import React from 'react';
import Axios from 'axios';
import QueueAnim from 'rc-queue-anim';
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Icon,
  Card
} from 'antd';
import ReCAPTCHA  from 'react-google-recaptcha'
const { Option } = Select;

const recaptchaRef = React.createRef();

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    show: true,
    serverError: false,
    captchaValid: false,
    captchaToken: ""
  };

  verifyRecaptchaCallback = (token) => {
    if (token) {
      this.setState({
        captchaValid: true,
        captchaToken: token
      });
    } 
    else {
      this.setState({
        captchaValid: false,
        captchaToken: ""
      });
      recaptchaRef.current.reset();
    }
  };

  handleSubmitSuccess = () => {
    this.setState({
      serverError: false,
      show: false
    });
  };

  handleSubmitFailure = (err) => {
    console.log(err);
    this.setState({
      serverError: true
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.captchaToken = this.state.captchaToken;
        Axios.post('/contacts', values).then(r => {
          this.handleSubmitSuccess();
        }).catch(err => {
          this.handleSubmitFailure(err);
        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('countryPrefix', {
      initialValue: '1',
    })(
      <Select style={{ width: 70 }}>
        <Option value="1">+1</Option>
        <Option value="62">+62</Option>
      </Select>,
    );

    return (
      <div>
        <QueueAnim>
          { this.state.show ? [
            <Form key="form" {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item label="Email" hasFeedback>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      message: 'Please input valid Email!',
                    },
                    {
                      required: true,
                      message: 'Please input your Email!',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="First Name" hasFeedback>
                {getFieldDecorator('firstName', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your first name!',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Last Name" hasFeedback>
                {getFieldDecorator('lastName', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your last name!',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="LinkedIn" hasFeedback>
                {getFieldDecorator('linkedin', {
                  rules: [
                    {
                      type: 'url',
                      message: 'Please input a valid url!',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Company">
                {getFieldDecorator('company')(<Input />)}
              </Form.Item>
              <Form.Item label="Profession">
                {getFieldDecorator('profession')(<Input />)}
              </Form.Item>
              <Form.Item label="Phone Number">
                {getFieldDecorator('phone', {
                  rules: [{ required: true, message: 'Please input your phone number!' }],
                })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="Verify">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LfWyqcUAAAAAHAHZBQBHTK3_siyqeoQicDcE6YR"
                  onChange={this.verifyRecaptchaCallback}
                />
              </Form.Item>
              <QueueAnim>
              { this.state.captchaValid ? 
                [
                  <Form.Item key="signup" {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                      SIGN UP
                    </Button>
                    { this.state.serverError ? 
                      <span style={{ color: 'red' }}>
                        <Icon style={{ fontSize: 22, marginLeft: 12 }} type="exclamation-circle" />
                      </span>
                      : null 
                    }
                  </Form.Item>
                ]
              : null }
              </QueueAnim>
            </Form>  
          ] : null }
        </QueueAnim>
        <QueueAnim delay={ 500 }>
          { !this.state.show ? [
            <Row key="confirm">
              <Col  type="flex" justify="space-around" align="middle">
                <Card>
                  <Icon style={{fontSize: 80}} type="smile" theme="twoTone" />
                  <br />
                  <br />
                  <h4 style={{fontSize: 16}}>
                    Thank you for submitting your response!
                    We have sent a confirmation email to your address. <b>Please check your spam folder and make sure to unmark the email as not spam</b> so that you can receive 
                    future event invites and newsletters in your inbox.
                  </h4>
                </Card>
              </Col>
            </Row>
          ] : null}
        </QueueAnim>
      </div>
    );
  }
}

const App = Form.create({ name: 'register' })(RegistrationForm);

export default App;
