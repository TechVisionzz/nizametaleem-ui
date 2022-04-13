import React, { Component } from "react";
import AppMenu from "../Menu/AppMenu";
import withTranslation from "next-translate/withTranslation";
import { Button, Col, Form, message, Row, Space, Table } from "antd";
import arabic from "react-date-object/calendars/arabic";
import arabic_locale from "react-date-object/locales/arabic_ar";
import DatePicker from "react-multi-date-picker";
import { addAttendence, getAllFaculty, getPeriods } from "../api/commonHelper";
import { Select } from "antd";
import withAuth from "../withAuth";
import moment from "moment";
var myself: any;
class Add extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      faculties: [],
      classes: [],
      classesDetails: [],
      sections: [],
      students: [],
      periods: [],
      attendences: [],
      attendenceDefaultValue: [],
      date: " ",
      year: " ",
    };
  }
  getAllFaculty = async () => {
    this.setState({ isSpinVisible: true });
    await getAllFaculty()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({
            faculties: response.data,
          });
          console.log(this.state.faculties);
        }
      })
      .catch(async (error: any) => {
        message.error(error.error);
        this.setState({ isSpinVisible: false });
      });
  };
  getPeriods = async () => {
    this.setState({ isSpinVisible: true });
    await getPeriods()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({
            periods: response.data,
          });
          console.log(this.state.periods);
        }
      })
      .catch(async (error: any) => {
        message.error(error.error);
        this.setState({ isSpinVisible: false });
      });
  };
  componentDidMount = async () => {
    this.getAllFaculty();
    this.getPeriods();
  };
  static async getInitialProps(ctx: any) {}
  handleFacultyChange = async (value: any) => {
    await this.setState({ classes: [], classesDetails: [] });
    console.log(value);
    var selectedItem = this.state.faculties.find(
      (item: any) => item.id == value
    );
    console.log(selectedItem);
    if (selectedItem) {
      if (selectedItem.attributes.classes.data.length >= 1) {
        selectedItem.attributes.classes.data.map(async (item2: any) => {
          var payload = {
            id: item2.id,
            name: item2.attributes.name,
          };
          await this.setState({ classes: [...this.state.classes, payload] });
          await this.setState({
            classesDetails: [...this.state.classesDetails, item2],
          });
          console.log(this.state.classes);
          console.log(this.state.classesDetails);
        });
      }
    }
  };
  handleClassChange = async (value: any) => {
    console.log(value);
    await this.setState({ sections: [], sectionsDetails: [] });
    var selectedItem = this.state.classesDetails.find(
      (item: any) => item.id == value
    );
    console.log(selectedItem);
    if (selectedItem) {
      if (selectedItem.attributes.sections.data.length >= 1) {
        selectedItem.attributes.sections.data.map(async (item2: any) => {
          var payload = {
            id: item2.id,
            name: item2.attributes.name,
          };
          await this.setState({
            sectionsDetails: [...this.state.sectionsDetails, item2],
          });
          await this.setState({ sections: [...this.state.sections, payload] });
          console.log(this.state.sections);
          console.log(this.state.sectionsDetails);
        });
      }
    }
  };
  handleSectionChange = async (value: any) => {
    console.log(value);
    await this.setState({ students: [] });
    console.log(value);
    var selectedItem = this.state.sectionsDetails.find(
      (item: any) => item.id == value
    );
    console.log(selectedItem);
    if (selectedItem) {
      if (selectedItem.attributes.students.data.length >= 1) {
        selectedItem.attributes.students.data.map(async (item2: any) => {
          var payload = {
            id: item2.id,
            name: item2.attributes.name,
          };
          await this.setState({ students: [...this.state.students, payload] });
          console.log(this.state.students);
        });
      }
    }
  };
  onFinish = async (values: any) => {
    this.setState({ isSpinVisible: true });
    var year: any, date: any, year: any, month: any, day: any;
    if (values.attendenceDate) {
      date = this.state.date;
      year = this.state.year;
      var splitDate = year.split("/");
      year = splitDate[0];
      month = splitDate[1];
      day = splitDate[2];
      console.log(year);
      console.log(month);
      console.log(day);
    }
    await this.setState({ attendences: [] });
    Promise.all(
      Object.entries(values).map(async ([key, value]) => {
        var a = key.split("-");
        if (key.startsWith(a[0] + "-")) {
          var studentAttendence = {
            date: date,
            year: year,
            month: month,
            day: day,
            status: value,
            student: a[0],
            period: a[1],
          };
          await this.setState({
            attendences: [...this.state.attendences, studentAttendence],
          });
        }
      })
    );
    // add attendence
    await addAttendence(this.state.attendences)
      .then(async (response: any) => {
        if (response) {
          console.log(response);
          const { t } = this.props.i18n;
          message.success(t("addSuccess"));
          this.setState({ isSpinVisible: false });
        }
      })
      .catch(async (error: any) => {
        message.error(error.eror);
        this.setState({ isSpinVisible: false });
      });
  };
  handleChange = async (value: any) => {
    await this.setState({
      year: moment(value.toDate()).format("YYYY/MM/DD"),
      date: moment(value.toDate()).format("MM/DD/YYYY"),
    });
    console.log(this.state.date);
  };
  render() {
    const { t } = this.props.i18n;
    const { Option } = Select;
    const { faculties, classes, sections, periods } = this.state;
    if (faculties.length === 0) {
      return <div>No Faculty Available</div>;
    }
    const columns: any = [
      {
        title: t("attendence.Name"),
        dataIndex: ["name"],
        key: "name",
      },
    ];
    if (periods.length >= 1) {
      periods.map((item: any) => {
        var periodObject = {
          title: item.attributes.title,
          key: item.attributes.title,
          width: "20%",
          render: (text: any, record: any) => (
            <Form.Item
              name={text.id + "-" + item.id}
              rules={[
                {
                  required: true,
                  message: item.attributes.title + " is required",
                },
              ]}
            >
              <Select defaultValue="present" style={{ width: "100px" }}>
                <Option key="present">{t("attendence.present")}</Option>
                <Option key="absent">{t("attendence.absent")}</Option>
                <Option key="leave">{t("attendence.leave")}</Option>
              </Select>
            </Form.Item>
          ),
        };
        columns.push(periodObject);
      });
    }
    return (
      <>
        <AppMenu />
        <Form
          name="basic"
          className="mainbody"
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          scrollToFirstError={true}
          // initialValues={{
          //   remember: true,
          //   faculty: faculties[0].attributes.name,
          // }}
          onFinish={this.onFinish}
        >
          <Row justify="space-between">
            <Col span={12}>
              <Form.Item
                name="faculty"
                label={t("attendence.Faculty")}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select onChange={this.handleFacultyChange}>
                  {faculties.map((faculty: any) => (
                    <Option key={faculty.id}>{faculty.attributes.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="class"
                label={t("attendence.Class")}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select onChange={this.handleClassChange}>
                  {(() => {
                    if (classes.length >= 1) {
                      return classes.map((item1: any) => {
                        return <Option key={item1.id}>{item1.name}</Option>;
                      });
                    }
                  })()}
                </Select>
              </Form.Item>
              <Form.Item
                name="subject"
                label={t("attendence.Section")}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select onChange={this.handleSectionChange}>
                  {(() => {
                    if (sections.length >= 1) {
                      return sections.map((item1: any) => {
                        return <Option key={item1.id}>{item1.name}</Option>;
                      });
                    }
                  })()}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("attendence.CertificateDate")}
                name="attendenceDate"
                rules={[
                  {
                    required: true,
                    message: " Attendence Date is required",
                  },
                ]}
              >
                {/* <Calendar calendar={arabic} locale={arabic_ar} />
                 */}
                <DatePicker
                  // value={value}
                  calendar={arabic}
                  locale={arabic_locale}
                  onChange={this.handleChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          {/* </Form>
        <Form
          name="control-hooks"
          onFinish={this.onFinish}
          className="mainbody"
        > */}
          <Table
            rowKey="id"
            bordered
            columns={columns}
            dataSource={this.state.students}
          />
          <Form.Item>
            <Row justify="space-between">
              <Col span={8}>
                <Button type="primary" htmlType="submit">
                  {t("submit")}
                </Button>
              </Col>
              <Col span={12}></Col>
            </Row>
          </Form.Item>
        </Form>
      </>
    );
  }
}
export default withAuth(withTranslation(Add, "common"));
