import React, { Component } from "react";
import AppMenu from "../Menu/AppMenu";
import withTranslation from "next-translate/withTranslation";
import { Col, Form, message, Row } from "antd";
import { getAllFaculty } from "../api/commonHelper";
import { Select } from "antd";
import withAuth from "../withAuth";
var myself: any;
// var classes: any;
class FacultyDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      faculties: [],
      classes: [],
      classesDetails: [],
      subjects: [],
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
  componentDidMount = async () => {
    this.getAllFaculty();
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
    await this.setState({ subjects: [] });
    console.log(value);
    var selectedItem = this.state.classesDetails.find(
      (item: any) => item.id == value
    );
    console.log(selectedItem);
    if (selectedItem) {
      if (selectedItem.attributes.subjects.data.length >= 1) {
        selectedItem.attributes.subjects.data.map(async (item2: any) => {
          var payload = {
            id: item2.id,
            name: item2.attributes.name,
          };
          await this.setState({ subjects: [...this.state.subjects, payload] });
          console.log(this.state.subjects);
        });
      }
    }
  };
  render() {
    const { t } = this.props.i18n;
    const { Option } = Select;
    const { faculties, classes, subjects } = this.state;
    if (faculties.length === 0) {
      return <div>No Faculty Available</div>;
    }
    return (
      <>
        <AppMenu />
        <Form
          className="mainbody"
          name="basic"
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
              <Form.Item name="faculty" label="Faculty">
                <Select onChange={this.handleFacultyChange}>
                  {faculties.map((faculty: any) => (
                    <Option key={faculty.id}>{faculty.attributes.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="class" label="Class">
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
              <Form.Item name="subject" label="Subjects">
                <Select onChange={this.handleClassChange}>
                  {(() => {
                    if (subjects.length >= 1) {
                      return subjects.map((item1: any) => {
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
      </>
    );
  }
}
export default withAuth(withTranslation(FacultyDetail, "common"));
