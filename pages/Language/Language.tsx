import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import React, { Component } from "react";
import setLanguage from "next-translate/setLanguage";
import { GlobalVars } from "../../global/global";
class Language extends Component<any, any> {
  changeLanguage = async (lng: any) => {};
  render() {
    return (
      <SubMenu key="SubMenu" title="Language">
        <Menu.Item
          key="english"
          onClick={async () => {
            GlobalVars.direction = "ltr";
            await setLanguage("en");
          }}
        >
          English
        </Menu.Item>
        <Menu.Item
          key="urdu"
          onClick={async () => {
            GlobalVars.direction = "rtl";
            await setLanguage("ur");
          }}
        >
          Urdu
        </Menu.Item>
        <Menu.Item
          key="arabic"
          onClick={async () => {
            GlobalVars.direction = "rtl";
            await setLanguage("ar");
          }}
        >
          Arabic
        </Menu.Item>
      </SubMenu>
    );
  }
}
export default Language;
