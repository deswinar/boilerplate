// Form.js
import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Form = () => {
  const [formData, setFormData] = useState([{ fieldName: '', fieldValue: '' }]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      const querySnapshot = await getDocs(collection(db, 'your_collection_name'));
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const addField = () => {
    setFormData([...formData, { fieldName: '', fieldValue: '' }]);
  };

  const removeField = (index) => {
    const newFormData = [...formData];
    newFormData.splice(index, 1);
    setFormData(newFormData);
  };

  const handleChange = (index, key, value) => {
    const newFormData = [...formData];
    newFormData[index][key] = value;
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editIndex !== null) {
        // Editing existing document
        const updatedData = { ...documents[editIndex], ...formData[0] };
        await updateDoc(doc(db, 'your_collection_name', updatedData.id), updatedData);
        setDocuments(documents.map((doc, i) => (i === editIndex ? updatedData : doc)));
        setEditIndex(null);
      } else {
        // Adding a new document
        const docRef = await addDoc(collection(db, 'your_collection_name'), { ...formData[0] });
        setDocuments([...documents, { id: docRef.id, ...formData[0] }]);
      }

      setFormData([{ fieldName: '', fieldValue: '' }]);
    } catch (error) {
      console.error('Error adding/updating document: ', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'your_collection_name', id));
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleEdit = (index) => {
    setFormData([{ ...documents[index] }]);
    setEditIndex(index);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {formData.map((field, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <TextField
              label="Field Name"
              value={field.fieldName}
              onChange={(e) => handleChange(index, 'fieldName', e.target.value)}
            />
            <TextField
              label="Field Value"
              value={field.fieldValue}
              onChange={(e) => handleChange(index, 'fieldValue', e.target.value)}
            />
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={editIndex === null ? <AddIcon /> : <SaveIcon />}
              type="submit"
            >
              {editIndex === null ? 'Add' : 'Save'}
            </Button>
          </div>
        ))}
      </form>

      <h2>Documents</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <List>
          {documents.map((doc, index) => (
            <ListItem key={index}>
              <ListItemText primary={doc.fieldName} secondary={doc.fieldValue} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEdit(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(doc.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default Form;