import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearErrors,
  errorSelector
} from '../../services/userData/userDataSlice';
import { useForm } from '../../hooks/useForm';
import { registerUserThunk } from '../../services/userData/userDataAction';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(errorSelector);

  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUserThunk({
        name: values.userName,
        email: values.email,
        password: values.password
      })
    );
  };

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return (
    <RegisterUI
      errorText={error!}
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={(e) => handleChange('email', e)}
      setPassword={(e) => handleChange('password', e)}
      setUserName={(e) => handleChange('userName', e)}
      handleSubmit={handleSubmit}
    />
  );
};
