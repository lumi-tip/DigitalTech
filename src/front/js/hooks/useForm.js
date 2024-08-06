import { useState } from 'react';

const useForm = (initialState) => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return [formState, handleChange];
};

export default useForm;