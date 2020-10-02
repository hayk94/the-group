import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import PeopleIcon from "@material-ui/icons/People";
import React from "react";
import { useMutation, useQueryCache } from "react-query";

import { GROUP_LIST_PATH } from "../../routes";
import { deleteGroup } from "../../services/groupService";
import ListItemLink from "../shared/ListItemLink";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(1),
  },
}));

const GroupListItemComponent = ({ name, id }) => {
  const classes = useStyles();

  const queryCache = useQueryCache();

  const [mutate] = useMutation(deleteGroup, {
    onSuccess: (data) => {
      console.log("data", data);
      queryCache.invalidateQueries("groupListQueryKey");
    },
  });

  return (
    <Paper className={classes.paper}>
      <ListItemLink to={`${GROUP_LIST_PATH}/${id}`}>
        <ListItemAvatar>
          <Avatar>
            <PeopleIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={name} />
        <ListItemSecondaryAction
          onClick={() => {
            mutate(id);
          }}
        >
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItemLink>
    </Paper>
  );
};

export default GroupListItemComponent;
