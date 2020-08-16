import React from "react";

import IconButton from "@material-ui/core/IconButton";
import { Tooltip, Paper } from "@material-ui/core";

import { red } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import SettingsIcon from "@material-ui/icons/Settings";

const LinearCoupledButtonGraphContainer = (props) => {
  return (
    <Paper>
      <Tooltip title="Config Equations" placement="top" arrow>
        <span>
          <IconButton
            disabled={!props.calculate}
            edge="end"
            aria-label="config"
            onClick={props.onGraphConfigOpen}
          >
            <SettingsIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Close" placement="top" arrow>
        <span>
          <IconButton edge="end" aria-label="add" onClick={props.onGraphClose}>
            <CloseIcon style={{ color: red[500] }} />
          </IconButton>
        </span>
      </Tooltip>
    </Paper>
  );
};

export default LinearCoupledButtonGraphContainer;
