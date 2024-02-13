// AddCollection.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { UserAuth } from '../../context/AuthContext';

const AddCollection = () => {
    const { user, loading, logout } = UserAuth();
    const navigate = useNavigate();
    const [collectionNameInput, setCollectionNameInput] = useState('');
    const [fields, setFields] = useState([]);
    const [newFieldName, setNewFieldName] = useState('');
    const [newFieldType, setNewFieldType] = useState('text');
  
    const handleAddCollection = async () => {
      try {
        if (!user) {
          // Handle the case where there is no authenticated user
          alert('User not authenticated');
          return;
        }

        if (!collectionNameInput.trim()) {
          alert('Please enter a valid collection name');
          return;
        }

        if (fields.length === 0) {
          alert('Please add at least one field');
          return;
        }
        
        const userCollectionsRef = collection(db, 'userCollections', user.uid, 'collections'); // Path based on user UID
  
        const newCollection = { name: collectionNameInput.trim(), fields };
        await addDoc(userCollectionsRef, newCollection);
        // After adding the collection, navigate back to the main page
        navigate('/collection-settings');
      } catch (error) {
        console.error('Error adding collection:', error);
      }
    };
  
    const handleAddField = () => {
      if (newFieldName.trim() === '') {
        alert('Please enter a valid field name');
        return;
      }
  
      if (fields.length >= 10) {
        alert('You can add up to 10 fields');
        return;
      }
  
      const newField = { name: newFieldName.trim(), type: newFieldType };
      setFields([...fields, newField]);
      setNewFieldName('');
    };

    const handleRemoveField = (index) => {
      const updatedFields = [...fields];
      updatedFields.splice(index, 1);
      setFields(updatedFields);
    };
  
    return (
        <Container>
          <div>
            <h2>Add Collection</h2>
    
            <TextField
              label="Collection Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={collectionNameInput}
              onChange={(e) => setCollectionNameInput(e.target.value)}
            />
    
            <Divider style={{ margin: '20px 0' }} />
    
            <h3>Add Field</h3>
    
            <TextField
              label="Field Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
            />
    
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                label="Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="integer">Integer</MenuItem>
                <MenuItem value="float">Float</MenuItem>
              </Select>
            </FormControl>
    
            <Button onClick={handleAddField} variant="contained" color="primary">
              Add Field
            </Button>
          </div>
    
          {/* Display added fields as a table */}
      {fields.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Added Fields:</h3>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={index}>
                    <TableCell>{field.name}</TableCell>
                    <TableCell>{field.type}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleRemoveField(index)} variant="contained" color="secondary">
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    
          <Divider style={{ margin: '20px 0' }} />
          <Button onClick={handleAddCollection} variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Save
          </Button>
        </Container>
      );
    };
  
  export default AddCollection;