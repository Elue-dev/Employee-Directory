import React from "react";
import "./info.scss";

export default function Info({ info, setInfo }) {
  return (
    <div className={info ? "info display" : "info"}>
      <div className="info__contents">
        <h2>Welcome to Employees Directory</h2>
        <p>
          This is an application where you can add employees to a directory,
          which gets stored in a database. <br /> <br />
          You can easily find employees by using the filters. You can search by
          their <b>name</b> or <b>location</b> and you can also filter them by
          the <b>department</b> they belong to.
        </p>
        <br />
        <p>
          The github repository for this project can be found{" "}
          <a href="https://github.com/Elue-dev/Employee-Directory">Here</a>
        </p>
        <button onClick={() => setInfo(false)}>Got it!</button>
      </div>
    </div>
  );
}
