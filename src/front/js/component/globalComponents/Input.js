import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
`;

const Input = ({ label, placeholder, type = 'text', value, onChange, name }) => {
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
    </InputContainer>
  );
};

export default Input;