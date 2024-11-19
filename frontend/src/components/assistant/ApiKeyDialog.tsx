import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

interface ApiKeyDialogProps {
  open: boolean;
  onClose: (apiKey?: string) => void;
}

export const ApiKeyDialog = ({ open, onClose }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = () => {
    onClose(apiKey);
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Enter OpenAI API Key</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="API Key"
          type="password"
          fullWidth
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}; 