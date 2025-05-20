import { useState,useEffect, useContext} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import styles from "./Customer.module.css";
import type { Customer as CustomerModel } from "../../types/Customer";
import CreateCustomer from "./components/CreateCustomer";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAppDispatch } from "../../redux/hooks";
import {
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} from "../../redux/services/ludotecaApi";

import { setMessage } from "../../redux/features/messageSlice";
import { LoaderContext } from "../../context/LoaderProvider";
import type { BackError } from "../../types/appTypes";

export const Customer = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useGetCustomersQuery(null);

  const [
    deleteCustomerApi,
    { isLoading: isLoadingDelete, error: errorDelete },
  ] = useDeleteCustomerMutation();
  const [createCustomerApi, { isLoading: isLoadingCreate }] =
    useCreateCustomerMutation();

  const [updateCustomerApi, { isLoading: isLoadingUpdate }] =
    useUpdateCustomerMutation();

  const [openCreate, setOpenCreate] = useState(false);

  const [customerToUpdate, setCustomerToUpdate] =
    useState<CustomerModel | null>(null);

    const createCustomer = (customer: string) => {
      setOpenCreate(false);
      if (customerToUpdate) {
        updateCustomerApi({ id: customerToUpdate.id, name: customer })
          .unwrap()
          .then(() => {
            dispatch(
              setMessage({
                text: "Cliente actualizado correctamente",
                type: "ok",
              })
            );
            setCustomerToUpdate(null);
          })
          .catch((error: any) => {
            let message = "Se produjo un errror al actualizar  el cliente";
            if(error?.data?.message) message = error.data.message;
            dispatch(setMessage({text: message, type:"error"}))
          });
      } else {
        createCustomerApi({ name: customer})
          .unwrap()
          .then(() => {
            dispatch(
              setMessage({ text: "Cliente creado correctamente", type: "ok" })
            );
            setCustomerToUpdate(null);
          })
          .catch((error: any) => {
            let message = "Se produjo un errror al actualizar  el cliente";
            if(error?.data?.message) message = error.data.message;
            dispatch(setMessage({text: message, type:"error"}))
      })
    }
    };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setCustomerToUpdate(null);
  };

  const deleteCustomer = () => {
    deleteCustomerApi(idToDelete)
      .then(() => {
        dispatch(
          setMessage({
            text: "Cliente borrado correctamente",
            type: "ok",
          })
        );
        setIdToDelete("");
      })
      .catch((err) => console.log(err));
  };

  const [idToDelete, setIdToDelete] = useState("");

  const loader = useContext(LoaderContext);

  useEffect(() => {
    if (errorDelete) {
      if ("status" in errorDelete) {
        dispatch(
          setMessage({
            text: (errorDelete?.data as BackError).msg,
            type: "error",
          })
        );
      }
    }
  }, [errorDelete, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setMessage({ text: "Se ha producido un error", type: "error" }));
    }
  }, [error]);

  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoading || isLoadingDelete || isLoadingUpdate
    );
  }, [isLoadingCreate, isLoading, isLoadingDelete, isLoadingUpdate]);

  return (
    <div className="container">
      <h1>Listado de Clientes</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              "& th": {
                backgroundColor: "lightgrey",
              },
            }}
          >
            <TableRow>
              <TableCell>Identificador</TableCell>
              <TableCell>Nombre cliente</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map((customer: CustomerModel) => (
              <TableRow
                key={customer.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {customer.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {customer.name}
                </TableCell>
                <TableCell>
                  <div className={styles.tableActions}>
                  <IconButton
                      aria-label="update"
                      color="primary"
                      onClick={() => {
                        setCustomerToUpdate(customer);
                        setOpenCreate(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => {
                          setIdToDelete(customer.id);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                      {!!idToDelete && (
                        <ConfirmDialog
                          title="Eliminar cliente"
                          text="Atención si borra el cliente se perderán sus datos. ¿Desea eliminar el cliente?"
                          confirm={deleteCustomer}
                          closeModal={() => setIdToDelete('')}
                        />
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Nuevo cliente
        </Button>
      </div>
      {openCreate && (
        <CreateCustomer
          create={createCustomer}
          customer={customerToUpdate}
          closeModal={handleCloseCreate}
        />
      )}
    </div>
  );
};