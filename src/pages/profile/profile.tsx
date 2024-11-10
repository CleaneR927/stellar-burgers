import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearErrors,
  errorSelector,
  userSelector
} from '../../services/userData/userDataSlice';
import { updateUserThunk } from '../../services/userData/userDataAction';
// Функционал страницы отвечает за отображение и редактирование профиля пользователя
export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const error = useSelector(errorSelector);

  const [formValue, setFormValue] = useState({
    name: user?.name!,
    email: user?.email!,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
    clearErrors();
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserThunk(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name!,
      email: user?.email!,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error!}
    />
  );
};
