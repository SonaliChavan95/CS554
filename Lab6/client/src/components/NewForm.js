import React from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Queries from '../Queries';
import { FormControl, InputLabel, Input, Button } from '@material-ui/core';

function NewForm({ img }) {
  let history = useHistory();
  const [ addPost, { loading: mutationLoading, error: mutationError }, ] = useMutation(Queries.ADD_POST);

  const onsubmit = async (e) => {
    e.preventDefault();
    const inputs = e.target.elements;

    try {
      validate(inputs);
      await addPost({
        variables: {
          posterName: inputs.author.value,
          url: inputs.url.value,
          description: inputs.description.value
        }
      });
      history.push(`/my-posts`);
    } catch (error) {
      console.log("error", error);
      document.getElementById('error').innerText = error;
    }
  };

  const validate = inputs => {
    const errors = [];
    if (!inputs.author.value) {
      errors.push('Provide author name');
    }
    if (!inputs.description.value) {
      errors.push('Provide description');
    }
    if (!inputs.url.value) {
      errors.push('Provide url');
    }
    if(errors.length > 0)
      throw new Error(errors);
  };

  return (
    <div style={{ padding: 16, margin: 'auto', maxWidth: 700 }}>
      <h1>Add a Post</h1>
      <form
        onSubmit={onsubmit}
      >
        <FormControl fullWidth>
          <InputLabel htmlFor="description">Description</InputLabel>
          <Input id="description" aria-describedby="my-helper-text" required/>
        </FormControl>
        <br />
        <FormControl fullWidth>
          <InputLabel htmlFor="url">Image URL</InputLabel>
          <Input id="url" aria-describedby="my-helper-text" required/>
        </FormControl>
        <br />
        <FormControl fullWidth>
          <InputLabel htmlFor="author">Author Name</InputLabel>
          <Input id="author" aria-describedby="my-helper-text" required/>
        </FormControl>
        <br />
        <br />

        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Add Post
        </Button>
      </form>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error :( Please try again</p>}
      <div id='error'></div>
    </div>
  );
}

export default NewForm;