import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import jwt_decode from "jwt-decode";
import React, { useEffect } from "react";
import ReactDiffViewer from "react-diff-viewer";
import { useQuery } from "react-query";

import { getAccessTokenFromLocalStorage } from "../../../helpers/authLocalStorage";
import { getUser } from "../../../services/userService";

const UserDiffDialogComponent = ({ handleClose, open, diffUserId }) => {
  const { sub: userId } = jwt_decode(getAccessTokenFromLocalStorage()) || {};

  const {
    data: currentUser,
    // error: queryError,
    // failureCount,
    // isError,
    // isFetchedAfterMount,
    // isFetching,
    // isIdle,
    // isLoading: isQueryLoading,
    // isPreviousData,
    // isStale,
    // isSuccess,
    // refetch,
    // remove,
    // status,
  } = useQuery(["profileQueryKey", userId], getUser, {
    // cacheTime,
    // enabled,
    // initialData,
    // initialStale,
    // isDataEqual,
    // keepPreviousData,
    // notifyOnStatusChange,
    // onError: () => {},
    // // onSettled,
    // onSuccess: (data) => {
    //   console.log("data", data);
    // },
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

  const { data: diffUser } = useQuery(
    ["profileQueryKey", diffUserId],
    getUser,
    {}
  );

  useEffect(() => {
    console.log("diffUser", diffUser);
    console.log("currentUser", currentUser);
  });

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"lg"}
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">User Diff</DialogTitle>
      <DialogContent>
        {/*<DialogContentText>*/}
        {/*  You can set my maximum width and whether to adapt or not.*/}
        {/*</DialogContentText>*/}
        <ReactDiffViewer
          oldValue={JSON.stringify(currentUser, null, 2)}
          newValue={JSON.stringify(diffUser, null, 2)}
          splitView={true}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDiffDialogComponent;
