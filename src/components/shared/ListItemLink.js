import ListItem from "@material-ui/core/ListItem";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const ListItemLink = (props) => {
  return <ListItem button component={RouterLink} {...props} />;
};

export default ListItemLink;
