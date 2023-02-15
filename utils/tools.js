import moment from "@/utils/moment/moment.js";

export const momentDate = function(value, details = "") {
  if (!value) return "";
  if(details == "HH:mm:ss") return moment(value).format("HH:mm:ss");
  if (details) return moment(value).format("YYYY-MM-DD HH:mm:ss");
  return moment(value).format("YYYY-MM-DD");
};

export const data = function() {};
