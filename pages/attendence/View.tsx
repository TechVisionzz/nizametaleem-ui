import { Button, Input, message, Popconfirm, Space, Table } from "antd";
import React, { Component } from "react";
import { GlobalVars } from "../../global/global";
import { encode } from "base-64";
import axios from "axios";
import { getAttendenceReport, getStudents } from "../api/commonHelper";
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
      attendenceReport: "",
    };
  }
  static async getInitialProps(ctx: any) {}
  getAttendenceReport = async () => {
    this.setState({ isSpinVisible: true });
    await getAttendenceReport()
      .then(async (response: any) => {
        console.log(response);
        await this.setState({ attendenceReport: response });
        console.log(this.state.attendenceReport.data);
      })
      .catch(async (error: any) => {
        message.error(error.error.message);
        this.setState({ isSpinVisible: false });
      });
  };
  componentDidMount = async () => {
    this.getAttendenceReport();
  };
  render() {
    const { t } = this.props.i18n;
    if (!this.state.attendenceReport) {
      return <div>Loading...</div>;
    }
    return (
      <>
        <AppMenu />
        <div
          dangerouslySetInnerHTML={{ __html: this.state.attendenceReport.data }}
        ></div>
      </>
    );
  }
}
export default withAuth(withTranslation(View, "common"));
