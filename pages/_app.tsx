import "../styles/globals.css";
import "../styles/common.css";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import { GlobalVars } from "../global/global";
import Router from "next/router";
import { isLoggedIn } from "./api/commonHelper";
function SecureRoute() {
  if (!isLoggedIn) {
    return true;
    // Router.push("/");
  }
  // return (
  //   <Route
  //     path={props.path}
  //     render={(data) =>
  //       isLoggedIn() ? (
  //         <props.component {...data}></props.component>
  //       ) : (
  //         <Redirect to={{ pathname: "/" }}></Redirect>
  //       )
  //     }
  //   ></Route>
  // );
}
function MyApp({ Component, pageProps }: AppProps) {
  if (!GlobalVars.direction) {
    GlobalVars.direction = "rtl";
  }
  return (
    // <SecureRoute>
    <div dir={GlobalVars.direction}>
      <Component {...pageProps} />
    </div>
    // </SecureRoute>
  );
}
export default MyApp;
