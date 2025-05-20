import { useContext, useEffect, useState, type ChangeEvent } from "react";
import type { Borrow } from "../../../types/Borrow";
import { LoaderContext } from "../../../context/LoaderProvider";
import { useGetGamesQuery,
  useGetCustomersQuery,

 } from "../../../redux/services/ludotecaApi";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import type { Game } from "../../../types/Game";
import type { Customer } from "../../../types/Customer";


interface Props {
  borrow: Borrow | null;
  closeModal: () => void;
  create: (borrow: Borrow) => void;
}

const initialState= {
  id: "",
  customer: undefined,
  game: undefined,
  startDate: null ,
  finishDate: null ,
  pageNumbre: 0,
  pageSize: 5
};


 export default function CreateBorrow(props: Props) {
    const [form, setForm] = useState<Borrow>(initialState);
    const [dateError, setDateError] = useState<string>(''); 
    const [gameError, setGameError] = useState<string>('');
    const loader = useContext(LoaderContext);
   // const [pageNumber, setPageNumber] = useState(0);
   // const [pageSize, setPageSize] = useState(5);
    const { data: games, isLoading: isLoadingGames } = useGetGamesQuery({
      title: "",
      idCategory: ""
    });
    const { data: customers, isLoading: isLoadingClients } = useGetCustomersQuery(null);

     useEffect(() => {
      loader.showLoading(isLoadingGames || isLoadingClients);
    }, [isLoadingGames, isLoadingClients]);

    useEffect(() => {
      if (props.borrow) {
        setForm({
          id: props.borrow?.id || "",
          customer: props.borrow?.customer,
          game: props.borrow?.game,
          startDate: props.borrow?.startDate ? new Date(props.borrow.startDate): new Date(),
          finishDate: props.borrow?.finishDate ? new Date(props.borrow.finishDate): new Date()
        });
      }
    }, [props?.borrow]);

  
    const handleChangeForm = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm({
        ...form,
        [event.target.id]: event.target.value,
      });
      setDateError('');
      setGameError('');
    };

     // cambios en selects
    const handleChangeSelect = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (event.target.name === "game") {
        const selectedGame = games?.find((game: { id: string; }) => game.id === event.target.value);
        setForm({
          ...form,
          game: selectedGame,
        });
      } else if (event.target.name === "customer") {
        const selectedCustomer = customers?.find((customer: { id: string; }) => customer.id === event.target.value);
        setForm({
          ...form,
          customer: selectedCustomer,
        });
      }
    };    

    const handleCreate = async () => {
      if (!form.customer || !form.game || !form.startDate || !form.finishDate) {
        setDateError("Todos los campos son obligatorios");
        return;
      }
  
       const newBorrow: Borrow = {
            id: "",
            customer: form.customer!,
            game: form.game!,
            startDate: form.startDate,
            finishDate: form.finishDate,
          };

          try{
             props.create(newBorrow);
             props.closeModal();
          } catch (error: any) {
            setGameError(error.message || "Ha ocurrido un error al intentar crear el préstamo")
          }  
    };

  
  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>
        <DialogTitle>
          {"Nuevo préstamo"}
        </DialogTitle>
        <DialogContent>
          {props.borrow && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.borrow.id}
              variant="standard"              
            />
          )}
          <TextField
            id="game"
            select
            label="Juego"
            defaultValue=""
            fullWidth
            variant="standard"
            name="game"
            value={form.game ? form.game.id : ""}
            onChange={handleChangeSelect}
          >
            {games &&
              games.map((option: Game) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            id="customer"
            select
            label="Cliente"
            defaultValue=""
            fullWidth
            variant="standard"
            name="customer"
            value={form.customer ? form.customer.id : ""}
            onChange={handleChangeSelect}
          >
            { customers &&
              customers.map((option: Customer) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            margin="dense"
            id="startDate"
            label="Fecha de inicio del préstamo"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.startDate}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            id="finishDate"
            label="Fecha de fin del préstamo"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.finishDate}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          {dateError && <div style={{ color: 'red' }}>{dateError}</div>}
          {gameError && <div style={{ color: 'red' }}>{gameError}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeModal}>Cancelar</Button>
          <Button
            onClick={handleCreate}
           
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );


 }
