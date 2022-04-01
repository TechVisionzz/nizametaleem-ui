import { Col, Menu, message, Row } from "antd";
import Router from "next/router";
import { Component } from "react";
import withTranslation from "next-translate/withTranslation";
import { GlobalVars } from "../../global/global";
import { getMenues, isLoggedIn, logOut } from "../api/commonHelper";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Language from "../Language/Language";
import SubMenu from "antd/lib/menu/SubMenu";
import withAuth from "../withAuth";

var myself: any, words: any;
class AppMenu extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      current: "1",
      menues: [],
    };
  }
  getMenues = async () => {
    await getMenues()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({ menues: response.data });
          console.log(this.state.menues);
        }
      })
      .catch(async (error: any) => {
        message.error(error.error);
        this.setState({ isSpinVisible: false });
      });
  };
  componentDidMount = async () => {
    this.getMenues();
  };
  logout = async () => {
    this.setState({ isSpinVisible: true });
    await logOut();
    Router.push("/");
    this.setState({ isSpinVisible: false });
  };
  handleClick = (e: any) => {
    console.log("click ", e);
    this.setState({ current: e.key });
  };
  callPage = async (link: any) => {
    Router.push(link);
  };
  parentMenu = (item: any) => {
    return (
      <>
        <SubMenu key={item.id} title={item.attributes.name}>
          {item.attributes.menues.data.map((item2: any) => {
            var a = this.state.menues.find((menu: any) => menu.id === item2.id);
            if (a) {
              if (a.attributes.menues.data[0]) {
                return this.parentMenu(a);
              }
            }

            return (
              <Menu.Item
                onClick={() => this.callPage(item2.attributes.link)}
                key={item2.id}
              >
                {item2.attributes.name}
              </Menu.Item>
            );
          })}
        </SubMenu>
      </>
    );
  };
  render() {
    const { t } = this.props.i18n;
    const { SubMenu } = Menu;
    return (
      <Menu key="main-menu" onClick={this.handleClick} mode="horizontal">
        {this.state.menues.map((item: any) => {
          if (
            item.attributes.parent.data === null &&
            !item.attributes.menues.data[0]
          ) {
            return (
              <Menu.Item
                onClick={() => this.callPage(item.attributes.link)}
                key={item.id}
              >
                {item.attributes.name}
              </Menu.Item>
            );
          }
          if (
            item.attributes.parent.data === null &&
            item.attributes.menues.data[0]
          ) {
            return this.parentMenu(item);
          }
        })}

        <Language />
        <Menu.Item onClick={this.logout} key="255">
          {t("menu.SignOut")}
        </Menu.Item>
      </Menu>
    );
  }
}
export default withAuth(withTranslation(AppMenu, "common"));
