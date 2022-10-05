import { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setChildDialogMethods } from "../../app/slices/ChildDialogSlice"; 
import CustomDialog from "./CustomDialog";

const ChildDialog = ({ showChildDialogActions = true, showChildDialogClose = false}) => {
  // Child Dialog config
  const [childDialogData, setChildDialogData] = useState({
    isOpen: false,
    title: "Child Dialog",
    nolabel: "NO",
    yeslabel: "YES",
    loadingYeslabel: "Updating...",
    action: () => {},
  });

  const [childDialogBody, setChildDialogBody] = useState(<></>);
  const dispatch = useAppDispatch();

  const displayChildDialog = (options:any) => setChildDialogData({ ...options, isOpen: true });
  const closeChildDialog = (data:any) => setChildDialogData({ ...data, isOpen: false });


  useEffect(() => {
    dispatch(
      setChildDialogMethods({
        setChildDialogBody,
        displayChildDialog,
        closeChildDialog, 
      })
    );
  }, [childDialogData]);

  return (
    <CustomDialog
      dialogData={childDialogData}
      closeDialog={closeChildDialog}
      showDialogActions={showChildDialogActions}
      showDialogClose={showChildDialogClose}
    >
      {childDialogBody}
    </CustomDialog>
  );
};

export default ChildDialog;
