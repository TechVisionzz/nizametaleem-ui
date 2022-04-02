import React, { Component } from "react";
import AppMenu from "../Menu/AppMenu";
import withTranslation from "next-translate/withTranslation";
import { Button, Col, Form, message, Modal, Row, Space, Table } from "antd";
import { getAllFaculty, getPeriods } from "../api/commonHelper";
import { Select } from "antd";
import AnnualResult from "./AnnualResult";
import SemesterResult from "./SemesterResult";
import withAuth from "../withAuth";
var myself: any;
class Result extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      annualModel: false,
      semesterModel: false,
      faculties: [],
      classes: [],
      classesDetails: [],
      classesDetail: {},
      sections: [],
      section: {},
      students: [],
      studentDetails: [],
      student: {},
      periods: [],
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
    await this.setState({ classDetail: selectedItem });
    console.log(this.state.classDetail);
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
    await this.setState({ students: [], studentDetails: [] });
    console.log(value);
    var selectedItem = this.state.sectionsDetails.find(
      (item: any) => item.id == value
    );
    await this.setState({ section: selectedItem });
    console.log(this.state.section);
    if (selectedItem) {
      if (selectedItem.attributes.students.data.length >= 1) {
        selectedItem.attributes.students.data.map(async (item2: any) => {
          var payload = {
            id: item2.id,
            name: item2.attributes.name,
          };
          await this.setState({
            students: [...this.state.students, payload],
            studentDetails: [...this.state.studentDetails, item2],
          });
          console.log(this.state.studentDetails);
        });
      }
    }
  };
  closeAnnualModel = () => {
    this.setState({ annualModel: false });
  };
  closeSemesterModel = () => {
    this.setState({ semesterModel: false });
  };
  openAnnualModel = async (id: any, name: any) => {
    var selectedItem = this.state.studentDetails.find(
      (item: any) => item.id == id
    );
    console.log(selectedItem);
    if (selectedItem) {
      await this.setState({ student: {} });
      await this.setState({ annualModel: true, student: selectedItem });
      console.log(this.state.student);
    }
  };
  openSemesterModel = async (id: any, name: any) => {
    console.log(id);
    var selectedItem = this.state.studentDetails.find(
      (item: any) => item.id == id
    );
    // console.log(selectedItem);
    if (selectedItem) {
      await this.setState({ student: {} });
      await this.setState({ semesterModel: true, student: selectedItem });
      console.log(this.state.student);
    }
    // await this.setState({ semesterModel: true });
  };
  render() {
    const { t } = this.props.i18n;
    const { Option } = Select;
    const { faculties, classes, student, sections, classDetail, section } =
      this.state;
    if (faculties.length === 0) {
      return <div>No Faculty Available</div>;
    }
    const columns: any = [
      {
        title: t("result.Name"),
        dataIndex: ["name"],
        key: "name",
        width: "40%",
      },
      {
        title: t("result.Result"),
        key: "Result",
        render: (text: any, record: any) => (
          <>
            <Button
              onClick={() => this.openAnnualModel(text.id, text.name)}
              type="link"
            >
              {t("result.Annual")}
            </Button>
            <Button
              onClick={() => this.openSemesterModel(text.id, text.name)}
              type="link"
            >
              {t("result.Semester")}
            </Button>
          </>
        ),
      },
    ];
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
          initialValues={{
            remember: true,
            faculty: faculties[0].attributes.name,
          }}
        >
          <Row justify="space-between">
            <Col span={12}>
              <Form.Item name="faculty" label={t("result.Faculty")}>
                <Select onChange={this.handleFacultyChange}>
                  {faculties.map((faculty: any) => (
                    <Option key={faculty.id}>{faculty.attributes.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="class" label={t("result.Class")}>
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
              <Form.Item name="subject" label={t("result.Section")}>
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
            </Col>
            <Col span={12}></Col>
          </Row>
        </Form>
        <Table
          className="tableStyle"
          rowKey="id"
          bordered
          columns={columns}
          dataSource={this.state.students}
        />
        {/* annual model */}
        <Modal
          width={800}
          maskClosable={true}
          closable={false}
          destroyOnClose={true}
          footer={null}
          title={t("result.AddAnnualResult")}
          visible={this.state.annualModel}
        >
          <AnnualResult
            closeAnnualModel={this.closeAnnualModel}
            classDetail={classDetail}
            section={section}
            studentDetail={student}
          />
        </Modal>
        {/* semester model */}
        <Modal
          width={800}
          maskClosable={true}
          closable={false}
          destroyOnClose={true}
          footer={null}
          title={t("result.AddSemesterResult")}
          visible={this.state.semesterModel}
        >
          <SemesterResult
            closeSemesterModel={this.closeSemesterModel}
            classDetail={classDetail}
            section={section}
            studentDetail={student}
          />
        </Modal>
      </>
    );
  }
}
export default withAuth(withTranslation(Result, "common"));
