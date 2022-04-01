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
import Router from "next/router";
import withTranslation from "next-translate/withTranslation";
import { addStudent, editStudent, getEditStudent } from "../api/commonHelper";
import moment from "moment";
import withAuth from "../withAuth";
var myself: any, myform: any;
myform = createRef();
class Add extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      student: {},
    };
  }
  getEditStudent = async () => {
    await getEditStudent()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({ student: response.data });
          console.log(this.state.student);
        }
      })
      .catch(async (error: any) => {
        message.error(error.error);
        this.setState({ isSpinVisible: false });
      });
  };
  componentDidMount = async () => {
    this.getEditStudent();
  };
  static async getInitialProps(ctx: any) {}
  onFinish = async (values: any) => {
    this.setState({ isSpinVisible: true });
    await editStudent(values)
      .then(async (response: any) => {
        if (response && response.data) {
          console.log(response.data);
          const { t } = this.props.i18n;
          message.success(t("editSuccess"));
          Router.push("/students/View");
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
    await this.setState({ isSpinVisible: false, student: {} });
    this.setState({
      visible: false,
    });
  };
  render() {
    const { t } = this.props.i18n;
    const { student } = this.state;
    if (!student || !student.attributes) {
      return <div>Loading...</div>;
    }
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
            initialValues={{
              remember: true,
              name: student ? student.attributes.name : " ",
              fatherName: student.attributes.fatherName,
              fatherCNIC: student.attributes.fatherCNIC,
              cast: student.attributes.cast,
              dob: moment(student.attributes.dob, "MM/DD/YYYY"),
              address: student.attributes.address,
              post: student.attributes.post,
              policeStation: student.attributes.policeStation,
              district: student.attributes.district,
              reilwayStation: student.attributes.reilwayStation,
              waya: student.attributes.waya,
              province: student.attributes.province,
              country: student.attributes.country,
              pinCode: student.attributes.pinCode,
              fatherContactNumber: student.attributes.fatherContactNumber,
              alreadyReadBooks: student.attributes.alreadyReadBooks,
              admissionDate: student.attributes.admissionDate,
              previousSchoolDetail: student.attributes.previousSchoolDetail,
              leavingReason: student.attributes.leavingReason,
              comment: student.attributes.comment,
              resultIssueDate: student.attributes.resultIssueDate,
              resultCardNumber: student.attributes.resultCardNumber,
            }}
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
