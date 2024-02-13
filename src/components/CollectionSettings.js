// CollectionSettings.js
import React, { useState, useEffect, useContext  } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Card, CardContent, CardActions, Grid, Breadcrumbs, Link as MuiLink  } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { UserAuth } from '../context/AuthContext';

const CollectionSettings = () => {
  const { user, loading, logout } = UserAuth();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        if (!user || !user.uid) {
          // Handle the case where there is no authenticated user
          return;
        }
        
        const userCollectionsRef = collection(db, 'userCollections', user.uid, 'collections');
        const collectionsQuery = query(userCollectionsRef);
        const querySnapshot = await getDocs(collectionsQuery);

        if (querySnapshot.size === 0) {
          // Handle the case where the query result is empty
          console.log('No collections found.');
          return;
        }

        const collectionList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCollections(collectionList);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, [user]);

  const handleRemoveCollection = (collectionId) => {
    // Add logic to remove the collection
    console.log('Remove collection with ID:', collectionId);
  };

  const handleEditCollection = (collectionId) => {
    // Add logic to edit the collection
    console.log('Edit collection with ID:', collectionId);
  };

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <MuiLink color="inherit" component={Link} to="/dashboard">
          Dashboard
        </MuiLink>
        <Typography color="textPrimary">Collection Settings</Typography>
      </Breadcrumbs>

      <Typography variant="h2">Collection Settings</Typography>
      <Grid container spacing={2}>
        {collections.map((collection) => (
          <Grid item key={collection.id} xs={12} sm={6}>
            <Card variant="outlined" sx={{ borderRadius: '16px', marginBottom: '16px' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {collection.name}
                </Typography>
                <ul>
                  {collection.fields.map((field, index) => (
                    <li key={index}>
                      {field.name}: {field.type}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleEditCollection(collection.id)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleRemoveCollection(collection.id)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Link to="/add-collection" style={{ textDecoration: 'none' }}>
        <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Add Collection
        </Button>
      </Link>
    </div>
  );
};

export default CollectionSettings;