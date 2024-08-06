import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border: ${({ variant }) => (variant === 'outlined' ? '2px solid #007bff' : 'none')};
  color: ${({ variant }) => (variant === 'outlined' ? '#007bff' : '#fff')};
  background-color: ${({ variant }) => (variant === 'outlined' ? 'transparent' : '#007bff')};

  &:hover {
    background-color: ${({ variant }) => (variant === 'outlined' ? '#007bff' : '#0056b3')};
    color: #fff;
  }

  &:active {
    transform: translateY(2px);
    background-color: ${({ variant }) => (variant === 'outlined' ? '#0056b3' : '#004494')};
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    border-color: #cccccc;
  }
`;

const Button = ({ children, onClick, disabled, variant = 'primary' }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled} variant={variant}>
      {children}
    </StyledButton>
  );
};

export default Button;