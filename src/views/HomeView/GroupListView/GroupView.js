import { List } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { useParams } from "react-router-dom";
import stringToColor from "string-to-color";

import UserDiffDialogComponent from "../../../components/GroupList/Group/UserDiffDialogComponent";
import { getAccessTokenFromLocalStorage } from "../../../helpers/authLocalStorage";
import useDialog from "../../../hooks/useDialog";
import {
  createGroup,
  getGroup,
  updateGroupUsers,
} from "../../../services/groupService";
import { getUser, getUserList } from "../../../services/userService";

const USER_LIST_DROP_ID = "droppable";
const GROUP_USER_LIST_DROP_ID = "droppable2";

const useStyles = makeStyles((theme) => ({
  listItemPaper: {
    marginBottom: theme.spacing(1),
  },
  listPaper: {
    padding: theme.spacing(1),
  },
}));

const GroupView = () => {
  const classes = useStyles();
  const { groupId } = useParams();
  const theme = useTheme();
  const queryCache = useQueryCache();

  const [
    isUserDiffDialogOpen,
    openUserDiffDialog,
    closeUserDiffDialog,
  ] = useDialog();

  const [diffUserId, setDiffUserId] = useState(null);

  const onUserDiff = (diffUserId) => {
    setDiffUserId(diffUserId);
    openUserDiffDialog();
  };

  const { data: groupData, isLoading: isGroupQueryLoading } = useQuery(
    ["groupQueryKey", groupId],
    getGroup
  );

  const { data: userListData, isLoading: isUserListQueryLoading } = useQuery(
    ["userListQueryKey"],
    getUserList
  );

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    setUserList(
      userListData?.filter((user) => {
        return !groupData?.userIds?.some(
          (groupUser) => groupUser.id === user.id
        );
      })
    );
  }, [groupData?.userIds, userListData]);

  const [mutate] = useMutation(updateGroupUsers, {
    // When mutate is called:
    onMutate: ({ userIds }) => {
      console.log("userIds onMutate", userIds);
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      queryCache.cancelQueries("groupQueryKey");

      // Snapshot the previous value
      const previousTodos = queryCache.getQueryData("groupQueryKey");

      // Optimistically update to the new value
      queryCache.setQueryData("groupQueryKey", (group) => {
        return {
          ...group,
          userIds,
        };
      });

      // Return the snapshotted value
      return () => queryCache.setQueryData("groupQueryKey", previousTodos);
    },
    // If the mutation fails, use the value returned from onMutate to roll back
    onError: (err, userIds, rollback) => rollback(),
    // Always refetch after error or success:
    onSettled: () => {
      queryCache.invalidateQueries("groupQueryKey");
    },
  });

  if (isGroupQueryLoading || isUserListQueryLoading) {
    return <CircularProgress />;
  }

  const getList = (id) => {
    if (id === USER_LIST_DROP_ID) {
      return userList;
    }

    if (id === GROUP_USER_LIST_DROP_ID) {
      return groupData?.userIds || [];
    }

    return [];
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log("source", source);
    console.log("destination", destination);
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === GROUP_USER_LIST_DROP_ID) {
        mutate({ userIds: items, groupId });
      } else {
        setUserList(items);
      }
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      const userList = result[USER_LIST_DROP_ID];
      const groupUserIds = result[GROUP_USER_LIST_DROP_ID];

      setUserList(userList);
      mutate({ userIds: groupUserIds, groupId });
    }
  };

  const renderUserDiffDialog = () => {
    if (!isUserDiffDialogOpen || !diffUserId) {
      return null;
    }
    return (
      <UserDiffDialogComponent
        open={isUserDiffDialogOpen}
        handleClose={closeUserDiffDialog}
        diffUserId={diffUserId}
      />
    );
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.listPaper} elevation={3}>
              <Typography component={"h6"} variant={"h6"}>
                Users
              </Typography>
              <Droppable droppableId={USER_LIST_DROP_ID}>
                {(provided, snapshot) => (
                  <List ref={provided.innerRef}>
                    {userList?.map((user, index) => {
                      const {
                        first_name,
                        last_name,
                        ["job title"]: jobTitle,
                        department,
                        id,
                      } = user;
                      const fullName = `${first_name} ${last_name}`;
                      const color = stringToColor(fullName);
                      return (
                        <Draggable
                          key={id}
                          draggableId={id?.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Paper
                              className={classes.listItemPaper}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                              onClick={() => {
                                onUserDiff(id);
                              }}
                            >
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar
                                    alt={`Avatar`}
                                    style={{
                                      color: theme.palette.getContrastText(
                                        color
                                      ),
                                      backgroundColor: color,
                                    }}
                                  >
                                    {first_name[0]}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={fullName}
                                  secondary={`${jobTitle}, ${department}`}
                                />
                              </ListItem>
                            </Paper>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.listPaper} elevation={3}>
              <Typography component={"h6"} variant={"h6"}>
                Group
              </Typography>
              <Droppable droppableId={GROUP_USER_LIST_DROP_ID}>
                {(provided, snapshot) => (
                  <List ref={provided.innerRef}>
                    {groupData?.userIds?.map((user, index) => {
                      const {
                        first_name,
                        last_name,
                        ["job title"]: jobTitle,
                        department,
                        id,
                      } = user;
                      const fullName = `${first_name} ${last_name}`;
                      const color = stringToColor(fullName);
                      return (
                        <Draggable
                          key={id}
                          draggableId={id?.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => {
                            return (
                              <Paper
                                onClick={() => {
                                  onUserDiff(id);
                                }}
                                className={classes.listItemPaper}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                              >
                                <ListItem>
                                  <ListItemAvatar>
                                    <Avatar
                                      alt={`Avatar`}
                                      style={{
                                        color: theme.palette.getContrastText(
                                          color
                                        ),
                                        backgroundColor: color,
                                      }}
                                    >
                                      {first_name?.[0]}
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={fullName}
                                    secondary={`${jobTitle}, ${department}`}
                                  />
                                </ListItem>
                              </Paper>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </Paper>
          </Grid>
        </Grid>
      </DragDropContext>
      {renderUserDiffDialog()}
    </>
  );
};

export default GroupView;

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
