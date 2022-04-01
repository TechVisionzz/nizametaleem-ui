import { Button, Input, message, Popconfirm, Space, Table } from "antd";
import React, { Component } from "react";
import { GlobalVars } from "../../global/global";
import { getStudents } from "../api/commonHelper";
import Router from "next/router";
import withTranslation from "next-translate/withTranslation";
import AppMenu from "../Menu/AppMenu";
import withAuth from "../withAuth";
var myself: any;
class View extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      students: [],
      isSpinVisible: false,
    };
  }
  static async getInitialProps(ctx: any) {}
  getStudents = async () => {
    this.setState({ isSpinVisible: true });
    await getStudents()
      .then((response: any) => {
        this.setState({ students: response.data });
      })
      .catch(async (error: any) => {
        message.error(error.error.message);
        this.setState({ isSpinVisible: false });
      });
  };
  componentDidMount = async () => {
    this.getStudents();
  };
  editStudent = async (id: any) => {
    GlobalVars.studentId = id;
    console.log(GlobalVars.studentId);
    Router.push("/students/Edit");
  };
  render() {
    const { t } = this.props.i18n;
    const columns: any = [
      {
        title: t("student.StudentName"),
        dataIndex: ["attributes", "name"],
        key: "name",
        width: "40%",
      },
      {
        title: t("student.FatherName"),
        dataIndex: ["attributes", "fatherName"],
        key: "fatherName",
        width: "30%",
      },
      {
        title: t("student.Action"),
        key: "Actions",
        render: (text: any, record: any) => (
          <Button
            onClick={(a) => {
              this.editStudent(record.id);
            }}
            size="small"
          >
            {t("edit")}
          </Button>
        ),
      },
    ];
    return (
      <>
        <AppMenu />
        <Table
          className="mainbody"
          rowKey="id"
          bordered
          columns={columns}
          dataSource={this.state.students}
        />
      </>
    );
  }
}
export default withAuth(withTranslation(View, "common"));
