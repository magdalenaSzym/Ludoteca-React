import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { Customer } from "../../../types/Customer";

interface Props {
  customer: Customer | null;
  closeModal: () => void;
  create: (name: string) => void;
}

export default function CreateCustomer(props: Props) {
  const [name, setName] = useState(props?.customer?.name || "");

  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>
        <DialogTitle>
          {props.customer ? "Actualizar Cliete" : "Crear Cliente"}
        </DialogTitle>
        <DialogContent>
          {props.customer && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.customer.id}
              variant="standard"
            />
          )}
          <TextField
            margin="dense"
            id="name"
            label="Nombre"
            fullWidth
            variant="standard"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeModal}>Cancelar</Button>
          <Button onClick={() => props.create(name)} disabled={!name}>
            {props.customer ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}