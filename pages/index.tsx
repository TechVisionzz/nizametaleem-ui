import { Button, Checkbox, Form, Input, Menu, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import login from "../styles/Home.module.css";
import { Component } from "react";
import { isLoggedIn, logIn } from "./api/commonHelper";
import Router from "next/router";
import React from "react";
import withTranslation from "next-translate/withTranslation";
import Language from "./Language/Language";

class Home extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isSpinVisible: false,
    };
  }
  static async getInitialProps(ctx: any) {}
  onFinish = async (values: any) => {
    this.setState({ isSpinVisible: true });
    await logIn(values)
      .then((response: any) => {
        if (isLoggedIn()) {
          this.setState({ isSpinVisible: false });
          Router.push("/students/Add");
        }
      })
      .catch(async (error: any) => {
        message.error(error.error);
        this.setState({ isSpinVisible: false });
      });
  };
  render() {
    const { t, lang } = this.props.i18n;
    return (
      <div className={login.logIn}>
        <Spin size="large" spinning={this.state.isSpinVisible}>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>{t("login.rememberme")}</Checkbox>
              </Form.Item>
              <a className="login-form-forgot" href="">
                {t("login.Forgotpassword")}
              </a>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                {t("login.LogIn")}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    );
  }
}
export default withTranslation(Home, "common");
