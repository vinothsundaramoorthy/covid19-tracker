import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBoxes.css";

function InfoBoxes({ title, caseCount, total, isRed, active, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"} `}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <h2 className={`infoBox__case ${!isRed && 'infoBox__case--lightGreen'}`}>{caseCount}</h2>
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBoxes;
