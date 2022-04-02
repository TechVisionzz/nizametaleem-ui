import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import React, { Component, createRef } from "react";
import withTranslation from "next-translate/withTranslation";
import arabic from "react-date-object/calendars/arabic";
import arabic_locale from "react-date-object/locales/arabic_ar";
import DatePicker from "react-multi-date-picker";
import { addResult, checkSemesterResult } from "../api/commonHelper";
import withAuth from "../withAuth";
var myself: any, myform: any;
myform = createRef();
class SemesterResult extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      visible: false,
      studentClass: {},
      section: {},
      subjects: [],
      studentDetail: {},
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      records: [],
    };
  }
  componentDidMount = async () => {
    if (myself.props.classDetail) {
      await this.setState({ studentClass: myself.props.classDetail });
      console.log(this.state.studentClass);
    }
    if (myself.props.studentDetail) {
      await this.setState({ studentDetail: myself.props.studentDetail });
      console.log(this.state.studentDetail);
    }

    if (myself.props.section) {
      await this.setState({ section: myself.props.section });
      console.log(this.state.section);
    }
    if (this.state.studentClass.attributes.subjects.data.length >= 1) {
      await this.setState({ subjects: [] });
      await Promise.all(
        await this.state.studentClass.attributes.subjects.data.map(
          async (item: any) => {
            var subjects = {
              id: item.id,
              attributes: { name: item.attributes.name },
            };
            await this.setState({
              subjects: [...this.state.subjects, subjects],
              selectedRowKeys: [...this.state.selectedRowKeys, item.id],
            });
          }
        )
      );
    }
  };
  static async getInitialProps(ctx: any) {}
  onClose = async () => {
    myself.props.closeSemesterModel();
  };
  onSelectChange = (selectedRowKeys: any) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  onFinish = async (values: any) => {
    this.setState({ isSpinVisible: true });
    var year: any;
    if (values.resultYear) {
      year = values.resultYear.format();
      year = year.split("/");
      console.log(year[0]);
    }
    // to check that the semester result is already added or not
    await checkSemesterResult(this.state.studentDetail.id)
      .then(async (response: any) => {
        if (response && response.data.length >= 1) {
          const { t } = this.props.i18n;
          message.warning(t("result.DataisAlreadyadded"));
          myself.props.closeSemesterModel();
          this.setState({ isSpinVisible: false });
        } else {
          Object.entries(values).map(async (t, k) => {
            if (t[0] !== "resultYear") {
              var record = {
                subject: t[0],
                obtainMarks: t[1],
                type: "semester",
                year: year[0],
                student: this.state.studentDetail.id,
              };
              await this.setState({ records: [...this.state.records, record] });
            }
          });
          await addResult(this.state.records)
            .then(async (response: any) => {
              if (response) {
                console.log(response);
                const { t } = this.props.i18n;
                message.success(t("addSuccess"));
                myself.props.closeSemesterModel();
                this.setState({ isSpinVisible: false });
              }
            })
            .catch(async (error: any) => {
              message.error(error.eror);
              this.setState({ isSpinVisible: false });
            });
        }
      })
      .catch(async (error: any) => {
        message.error(error.eror);
        this.setState({ isSpinVisible: false });
      });
  };
  render() {
    const { section, studentClass, selectedRowKeys, subjects, studentDetail } =
      this.state;
    if (
      !section ||
      !studentClass ||
      !studentDetail ||
      !studentDetail.attributes
    ) {
      return <div>Loading...</div>;
    }
    const { t } = this.props.i18n;
    const columns: any = [
      {
        title: t("result.SubjectName"),
        dataIndex: ["attributes", "name"],
        key: "name",
        width: "40%",
      },
      {
        title: t("result.ObtainMarks"),
        key: "Marks",
        render: (text: any, record: any) => (
          <>
            <Form.Item
              name={text.id}
              rules={[
                {
                  required: true,
                  message: text.attributes.name + " marks is required",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </>
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: [Table.SELECTION_ALL],
    };
    return (
      <>
        <Spin size="large" spinning={this.state.isSpinVisible}>
          <Form
            name="control-hooks"
            onFinish={this.onFinish}
            className="mainbody"
          >
            <Row justify="space-between">
              <Col span={12}>
                <Space>
                  <span>{t("result.Name")}:</span>
                  <span>{studentDetail.attributes.name}</span>
                </Space>
                <div>
                  <Space>
                    <Form.Item
                      label={t("result.Year")}
                      name="resultYear"
                      rules={[
                        {
                          required: true,
                          message: "date is required",
                        },
                      ]}
                    >
                      <DatePicker calendar={arabic} locale={arabic_locale} />
                    </Form.Item>
                  </Space>
                </div>
              </Col>
              <Col span={12}></Col>
            </Row>

            <Table
              rowKey="id"
              bordered
              columns={columns}
              dataSource={this.state.subjects}
              // rowSelection={rowSelection}
            />
            <div>
              <Form.Item>
                <Row justify="space-between">
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
              </Form.Item>
            </div>
          </Form>
        </Spin>
      </>
    );
  }
}

export default withAuth(withTranslation(SemesterResult, "common"));
