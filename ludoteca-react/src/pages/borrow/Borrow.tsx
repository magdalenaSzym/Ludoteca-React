import { FormControl,TextField, MenuItem,Button, TableContainer,Paper, Table,TableHead, TableRow,
         TableCell, TableBody, IconButton, TableFooter, TablePagination } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { LoaderContext } from "../../context/LoaderProvider";
import { setMessage } from "../../redux/features/messageSlice";
import { useAppDispatch } from "../../redux/hooks";
import { 
    useGetGamesQuery, 
    useDeleteBorrowMutation, 
    useCreateBorrowMutation, 
    useGetCustomersQuery, 
    useGetBorrowsByPageQuery } from "../../redux/services/ludotecaApi";
import type { Customer } from "../../types/Customer";
import type { Game } from "../../types/Game";
import type { Borrow as BorrowModel } from "../../types/Borrow";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ClearIcon, DesktopDatePicker } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import  CreateBorrow  from "../borrow/components/CreateBorrow";
import styles from './Borrow.module.css';

export const Borrow = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [borrows, setBorrows] = useState<BorrowModel[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string>("");
  const [filterbyGame, setFilterByGame] = useState("");
  const [filterbyCustomer, setFilterByCustomer] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const dispatch = useAppDispatch();
  const loader = useContext(LoaderContext);

  const { data: customers } = useGetCustomersQuery(null);
  console.log("CUSTOMERS", customers);
  const { data: games } = useGetGamesQuery({title: '', idCategory: ''});



  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageNumber(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageNumber(0);
    setPageSize(parseInt(event.target.value, 10));
  };

  const { data: dataPage, isFetching: isFetchingPage } 
  =  useGetBorrowsByPageQuery({
    pageNumber,
    pageSize,
    gameId: filterbyGame ,
    customerId: filterbyCustomer,
    date: filterDate ? dayjs(filterDate).startOf('day').format('YYYY-MM-DD'): '',
  });

  const [deleteBorrowApi, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeleteBorrowMutation();

  const [createBorrowApi, { isLoading: isLoadingCreate, error: errorCreate }] =
    useCreateBorrowMutation();

  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoadingDelete || isFetchingPage
    );
  }, [isLoadingCreate, isLoadingDelete, isFetchingPage]);

  useEffect(() => {
    if (dataPage) {
      setBorrows(dataPage.content);
      setTotal(dataPage.totalElements);
    }
  }, [dataPage, filterbyGame, filterbyCustomer, filterDate, pageNumber, pageSize]);

  useEffect(() => {
    if (errorCreate) {
      setMessage({
        text: "Se ha producido un error al crear el préstamo",
        type: "error",
      });
      
    }
  }, [errorCreate]);

  useEffect(() => {
    if (errorDelete) {
      if("status" in errorDelete) {
        dispatch(
          setMessage({
            text: "Se ha producido un error al eliminar el préstamo",
            type: "error",
          })
        );
      }
    }
  }, [errorDelete, dispatch]);

  useEffect(() => {}, [filterbyGame, filterbyCustomer, filterDate, pageNumber, pageSize]);

  const createBorrow = (borrow: BorrowModel) => {
    setOpenCreate(false);
    createBorrowApi(borrow)
      .unwrap()
      .then(() => {
        setPageNumber(0);
        dispatch(
          setMessage({ text: "Préstamo creado correctamente", type: "ok" })
        );
      })
      .catch((error) => {
         let message = "Se ha producido un error al crear el préstamo";
         if(error?.data?.message) message= error.data.message;
        dispatch(setMessage({ text: message, type: "error" }));
      })
  };

  const handleDeleteBorrow = () => {
    if (idToDelete){
      deleteBorrowApi(idToDelete)
      .then(() => {
        setPageNumber(0);
        setIdToDelete("");
      })
      .catch((error) => {
        console.log("Error al eliminar el préstamo", error);
        dispatch(setMessage({text:"Error al eliminar el préstamo", type:"error"}));
      });
    }else{dispatch(setMessage({text:"No se ha seleccionado ningún préstamo", type:"error"}));}
  };

  return (
    <div className="container">
      <h1>Préstamos</h1>
      <div className={styles.filter}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            id="game"
            select
            label="Juego"
            fullWidth
            variant="standard"
            name="game"
            value={filterbyGame}
            onChange={(e) => setFilterByGame(e.target.value)}
          >
            {
              games?.map((game: Game) => (
                <MenuItem key={game.id} value={game.id}>
                  {game.title}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            id="client"
            select
            label="Cliente"
            fullWidth
            variant="standard"
            name="client"
            value={filterbyCustomer}
            onChange={(e) => setFilterByCustomer(e.target.value)}
          >
            {
              customers?.map((customer: Customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DesktopDatePicker"]}>
            <DemoItem label="Fecha">
              <DesktopDatePicker
              
                value={filterDate ? dayjs(filterDate) : null}
                onChange={(newDate) => {
                  if(newDate && newDate.isValid()){
                  setFilterDate(newDate.startOf('day').toDate());
                }else{
                  setFilterDate(null);
                }
              }}
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>

        <Button
        variant="outlined"
        sx= {{ marginTop:2, height: 40}}
        onClick={() => {
          setFilterByGame("");
          setFilterByCustomer("");
          setFilterDate(null);
        }}
        >
          Limpiar
        </Button>
        </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead
            sx={{
              "& th": {
                backgroundColor: "lightgrey",
              },
            }}
          >
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Juego</TableCell>
              <TableCell>Fecha inicio préstamo</TableCell>
              <TableCell>Fecha fin préstamo</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrows.map((borrow: BorrowModel) => (
              <TableRow key={borrow.id}>
                <TableCell component="th" scope="row">{borrow.id}</TableCell>
                <TableCell style={{ width: 160 }}>{borrow.customer?.name}</TableCell>
                <TableCell style={{ width: 160 }}>{borrow.game?.title}</TableCell>
                <TableCell style={{ width: 160 }}>{borrow.startDate ? dayjs(borrow.startDate).format('DD-MM-YYYY') : ''}</TableCell>
                <TableCell  style={{ width: 160 }}>{borrow.finishDate ? dayjs(borrow.finishDate).format('DD-MM-YYYY') : ''}</TableCell>
                <TableCell align="right">
                  <div className={styles.tableActions}>
                    <IconButton
                      aria-label="delete"
                      color="primary"
                      onClick={() => {
                        setIdToDelete(borrow.id);;
                      }}
                    >
                      <ClearIcon />
                    </IconButton>                    
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={4}
                count={total}
                rowsPerPage={pageSize}
                page={pageNumber}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Préstamo nuevo
        </Button>
      </div>
      {openCreate && (
        < CreateBorrow
          create={createBorrow}
          borrow={null}
          closeModal={() => {
            setOpenCreate(false);
          }}
        />
      )}
      {!!idToDelete && (
        <ConfirmDialog
          title="Eliminar préstamo"
          text="Atención va a eliminar el préstamo, se perderán todos sus datos, ¿proceder?"
          confirm={handleDeleteBorrow}
          closeModal={() => setIdToDelete("")}
        />
      )}
    </div>
  );
};