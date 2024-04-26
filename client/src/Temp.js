import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Temp = () => {
  // const { _id } = useSelector((state) => state.user);
  // const { accessToken } = useSelector((state) => state.token);
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjEyNjgyZjc3ZTFjYTU0Yzc5YjhjMzciLCJlbWFpbCI6IjEwQHRyeS5jb20iLCJmaXJzdE5hbWUiOiJrcnVuYWwiLCJsYXN0TmFtZSI6InBhdGVsIiwiaWF0IjoxNzEzOTg5NDQ1LCJleHAiOjE3MTQwNzU4NDV9.3jsVm16x2bel2XJLiei7Z0RxTq8JQMWbO3aCcG045HI";
  useEffect(() => {
    async function hello() {
      const ans = await axios.post(
        "http://localhost:3001/auth/connections/6612682f77e1ca54c79b8c37"
      );
      console.log("hello milind", ans);
    }
    hello();
    // console.log("This is the data i am looking for", await hello());
  }, []);
  return <div>Temp</div>;
};

export default Temp;
