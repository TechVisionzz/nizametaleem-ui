import { Button, Input, message, Popconfirm, Space, Table } from "antd";
import React, { Component } from "react";
import { GlobalVars } from "../../global/global";
import { encode } from "base-64";
import axios from "axios";
import { getResultReport, getStudents } from "../api/commonHelper";
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
      resultReport: "",
    };
  }
  static async getInitialProps(ctx: any) {}
  getResultReport = async () => {
    this.setState({ isSpinVisible: true });
    await getResultReport()
      .then(async (response: any) => {
        console.log(response);
        await this.setState({ resultReport: response });
        console.log(this.state.resultReport.data);
      })
      .catch(async (error: any) => {
        message.error(error.error.message);
        this.setState({ isSpinVisible: false });
      });
  };
  componentDidMount = async () => {
    this.getResultReport();
  };

  render() {
    const { t } = this.props.i18n;
    if (!this.state.resultReport) {
      return <div>Loading...</div>;
    }
    return (
      <>
        <AppMenu />

        <div
          dangerouslySetInnerHTML={{ __html: this.state.resultReport.data }}
        ></div>
      </>
    );
  }
}
export default withAuth(withTranslation(View, "common"));
