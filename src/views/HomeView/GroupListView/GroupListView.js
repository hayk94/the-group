import { Container } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import jwt_decode from "jwt-decode";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { Route, Switch } from "react-router-dom";

import GroupListItemComponent from "../../../components/GroupList/GroupListItemComponent";
import { getAccessTokenFromLocalStorage } from "../../../helpers/authLocalStorage";
import { GROUP_LIST_PATH, GROUP_PATH } from "../../../routes";
import { createGroup, getGroupList } from "../../../services/groupService";
import { getUserList } from "../../../services/userService";
import GroupView from "./GroupView";

const useStyles = makeStyles((theme) => ({
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  listItemPaper: {
    marginBottom: theme.spacing(1),
  },

  addButton: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const GroupListView = () => {
  const classes = useStyles();

  const { sub: userId } = jwt_decode(getAccessTokenFromLocalStorage()) || {};

  const {
    data: groupListData,
    error: queryError,
    // failureCount,
    // isError,
    // isFetchedAfterMount,
    // isFetching,
    // isIdle,
    isLoading: isQueryLoading,
    // isPreviousData,
    // isStale,
    // isSuccess,
    // refetch,
    // remove,
    // status,
  } = useQuery(["groupListQueryKey", userId], getGroupList, {
    // cacheTime,
    // enabled,
    // initialData,
    // initialStale,
    // isDataEqual,
    // keepPreviousData,
    // notifyOnStatusChange,
    onError: () => {},
    // onSettled,
    onSuccess: (data) => {
      console.log("data", data);
    },
    // queryFnParamsFilter,
    // queryKeySerializerFn,
    // refetchInterval,
    // refetchIntervalInBackground,
    // refetchOnMount,
    // refetchOnReconnect,
    // refetchOnWindowFocus,
    // retry,
    // retryDelay,
    // staleTime,
    // structuralSharing,
    // suspense,
    // useErrorBoundary,
  });

  const queryCache = useQueryCache();

  const [
    mutate,
    { status, isIdle, isLoading, isSuccess, isError, data, error, reset },
  ] = useMutation(createGroup, {
    // onMutate,
    onSuccess: (data) => {
      console.log("data", data);
      queryCache.invalidateQueries("groupListQueryKey");
      // history.push("/");
    },
    // onSettled,
    // throwOnError,
    // useErrorBoundary,
  });

  useEffect(() => {
    queryCache.prefetchQuery("userListQueryKey", getUserList);
  }, [queryCache]);

  if (isQueryLoading) {
    return <CircularProgress />;
  }

  return (
    <Switch>
      <Route exact path={GROUP_LIST_PATH}>
        <Container component="main" maxWidth="xs">
          <div className={classes.demo}>
            <List>
              {groupListData.map(({ id, name }) => {
                return (
                  <GroupListItemComponent
                    key={id}
                    id={id}
                    name={`${name}-${id}`}
                  />
                );
              })}
            </List>
          </div>
          <Fab
            onClick={() => {
              mutate({ name: "group", userId });
            }}
            disabled={isLoading}
            className={classes.addButton}
            color="primary"
            aria-label="add group"
          >
            <AddIcon />
          </Fab>
        </Container>
      </Route>
      <Route path={GROUP_PATH}>
        <GroupView />
      </Route>
    </Switch>
  );
};

export default GroupListView;
