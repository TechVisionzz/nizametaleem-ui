import moment from "moment";
import Strapi from "strapi-sdk-js";
import { GlobalVars } from "../../global/global.js";
var qs = require("qs");
const strapi = new Strapi({
  url: process.env.STRAPI_URL || "http://localhost:1337",
});
const signUp = async (values: any) => {
  await strapi.register({
    email: values.email,
    username: values.username,
    password: values.password,
  });
};
const logIn = async (values: any) => {
  return await strapi.login({
    identifier: values.username,
    password: values.password,
  });
};
const isLoggedIn = () => {
  return strapi.user ? true : false;
};
const logOut = () => {
  return strapi.logout();
};
const addStudent = async (values: any) => {
  return await strapi.create("students", {
    name: values.name,
    fatherName: values.fatherName,
    fatherCNIC: values.fatherCNIC,
    cast: values.cast,
    dob: moment(values.dob).format("MM/DD/YYYY"),
    address: values.address,
    post: values.post,
    policeStation: values.policeStation,
    reilwayStation: values.reilwayStation,
    district: values.district,
    province: values.province,
    country: values.country,
    pinCode: values.pinCode,
    fatherContactNumber: values.fatherContactNumber,
    alreadyReadBooks: values.alreadyReadBooks,

    admissionDate: values.admissionDate.format(),
    previousSchoolDetail: values.previousSchoolDetail,
    leavingReason: values.leavingReason,
    resultIssueDate: values.resultIssueDate.format(),
    resultCardNumber: values.resultCardNumber,
    waya: values.waya,
    comment: values.comment,
  });
};
const addResult = async (values: any) => {
  return await strapi.create("results", {
    modifiedData: values,
  });
};
const addAttendence = async (values: any) => {
  return await strapi.create("attendences", {
    modifiedData: values,
  });
};
const editStudent = async (values: any) => {
  return await strapi.update("students", GlobalVars.studentId, {
    name: values.name,
    fatherName: values.fatherName,
    fatherCNIC: values.fatherCNIC,
    cast: values.cast,
    dob: moment(values.dob).format("MM/DD/YYYY"),
    address: values.address,
    post: values.post,
    policeStation: values.policeStation,
    reilwayStation: values.reilwayStation,
    district: values.district,
    province: values.province,
    country: values.country,
    pinCode: values.pinCode,
    fatherContactNumber: values.fatherContactNumber,
    alreadyReadBooks: values.alreadyReadBooks,

    admissionDate: values.admissionDate.format(),
    previousSchoolDetail: values.previousSchoolDetail,
    leavingReason: values.leavingReason,
    resultIssueDate: values.resultIssueDate.format(),
    resultCardNumber: values.resultCardNumber,
    waya: values.waya,
    comment: values.comment,
  });
};
const getAllFaculty = async () => {
  const query = qs.stringify({
    populate: [
      "classes",
      "classes.subjects",
      "classes.sections",
      "classes.sections.students",
    ],
  });
  return await strapi.find(`faculties?${query}`);
};
const getPeriods = async () => {
  return await strapi.find(`periods`);
};
const getStudents = async () => {
  return await strapi.find(`students`);
};
const checkSemesterResult = async (id: any) => {
  const query = qs.stringify({
    populate: "*",
    filters: {
      $and: [
        {
          student: {
            id: {
              $eq: id,
            },
          },
        },
        {
          type: {
            $eq: "semester",
          },
        },
        {
          year: {
            $eq: "١٤٤٣",
          },
        },
      ],
    },
  });
  return await strapi.find(`results?${query}`);
};
const checkAnnualResult = async (id: any) => {
  const query = qs.stringify({
    populate: "*",
    filters: {
      $and: [
        {
          student: {
            id: {
              $eq: id,
            },
          },
        },
        {
          type: {
            $eq: "annual",
          },
        },
        {
          year: {
            $eq: "١٤٤٣",
          },
        },
      ],
    },
  });
  return await strapi.find(`results?${query}`);
};
const getMenues = async () => {
  const query = qs.stringify({
    populate: "*",
  });
  return await strapi.find(`menus?${query}`);
};
const getEditStudent = async () => {
  return await strapi.findOne("students", GlobalVars.studentId, {
    populate: "*",
  });
};

export {
  logOut,
  addAttendence,
  checkSemesterResult,
  checkAnnualResult,
  addResult,
  getPeriods,
  getMenues,
  editStudent,
  getAllFaculty,
  addStudent,
  logIn,
  isLoggedIn,
  getStudents,
  getEditStudent,
};
