import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Space,
  Spin,
} from "antd";
import React, { Component, createRef } from "react";
import AppMenu from "../Menu/AppMenu";
import { Calendar } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import withAuth from "../withAuth";
import withTranslation from "next-translate/withTranslation";
import { addStudent, isLoggedIn } from "../api/commonHelper";
import moment from "moment";
import Router from "next/router";
var myself: any, myform: any;
myform = createRef();
class Add extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      visible: false,
      check: "",
      collection: {},
      collections: [],
      parentIsAvailable: false,
    };
  }
  componentDidMount = async () => {
    // if (!isLoggedIn) {
    //   Router.push("/");
    // }
  };
  static async getInitialProps(ctx: any) {}
  onFinish = async (values: any) => {
    console.log(values);
    this.setState({ isSpinVisible: true });
    await addStudent(values)
      .then(async (response: any) => {
        if (response && response.data) {
          console.log(response.data);
          const { t } = this.props.i18n;
          message.success(t("addSuccess"));
          myform.current.resetFields();
          this.setState({ isSpinVisible: false });
        }
      })
      .catch(async (error: any) => {
        message.error(error.eror);
        this.setState({ isSpinVisible: false });
      });
  };
  onFinishFailed = async (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  onClose = async () => {
    await this.setState({ isSpinVisible: false, collection: "" });
    this.setState({
      visible: false,
    });
  };
  render() {
    const { t } = this.props.i18n;
    return (
      <>
        <AppMenu />
        <Spin size="large" spinning={this.state.isSpinVisible}>
          <Form
            className="mainbody"
            ref={myform}
            layout="horizontal"
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
            <Row justify="space-between">
              <Col span={12}>
                <Form.Item label={t("student.StudentName")} name="name">
                  <Input />
                </Form.Item>
                <Form.Item label={t("student.FatherName")} name="fatherName">
                  <Input />
                </Form.Item>
                <Form.Item label={t("student.CNIC")} name="fatherCNIC">
                  <Input />
                </Form.Item>
                <Form.Item label={t("student.Cast")} name="cast">
                  <Input />
                </Form.Item>
                <Form.Item label={t("student.DoB")} name="dob">
                  <DatePicker />
                </Form.Item>
                <Form.Item name="address" label={t("student.Address")}>
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label={t("student.Post")} name="post">
                  <Input />
                </Form.Item>
                <Form.Item
                  label={t("student.PoliceStation")}
                  name="policeStation"
                >
                  <Input />
                </Form.Item>
                <Form.Item label={t("student.District")} name="district">
                  <Input />
                </Form.Item>
                <Form.Item
                  label={t("student.RailwayStation")}
                  name="reilwayStation"
                >
                  <Input />
                </Form.Item>
                <Form.Item label={t("student.Distance")} name="waya">
                  <Input />
                </Form.Item>
                <Form.Item label={t("student.Province")} name="province">
                  <Input />
                </Form.Item>
                <Form.Item label={t("student.Country")} name="country">
                  <Input />
                </Form.Item>
                <Form.Item label={t("student.PinCode")} name="pinCode">
                  <Input />
                </Form.Item>
                <Form.Item
                  label={t("student.FaterContactNumber")}
                  name="fatherContactNumber"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={t("student.PreviousBooksReading")}
                  label="Previous Books Reading"
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("student.AdmissionDate")}
                  name="admissionDate"
                >
                  <Calendar calendar={arabic} locale={arabic_ar} />
                </Form.Item>
                <Form.Item
                  name="previousSchoolDetail"
                  label={t("student.PreviousSchoolName")}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  label={t("student.LeavingSchoolReason")}
                  name="leavingReason"
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label={t("student.Comments")} name="comment">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  label={t("student.CertificateDate")}
                  name="resultIssueDate"
                >
                  <Calendar calendar={arabic} locale={arabic_ar} />
                </Form.Item>
                <Form.Item
                  name="resultCardNumber"
                  label={t("student.CertificateNumber")}
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col span={2}></Col>
              <Col span={8}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {t("submit")}
                  </Button>
                  <Button onClick={this.onClose}>{t("Cancel")}</Button>
                </Space>
              </Col>
              <Col span={12}></Col>
            </Row>
          </Form>
        </Spin>
      </>
    );
  }
}

export default withAuth(withTranslation(Add, "common"));
