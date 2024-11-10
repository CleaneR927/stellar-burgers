import { FC, SyntheticEvent, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearErrors,
  errorSelector
} from '../../services/userData/userDataSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { loginUserThunk } from '../../services/userData/userDataAction';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(errorSelector);
  const navigate = useNavigate();
  const location = useLocation();
  /*
Инициализируется состояние формы с использованием пользовательского хука `useForm`. 
Здесь `values` хранит текущее состояние полей формы (email и password), а `handleChange` — функция для обновления значений
*/
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });
  /*
  Если в состоянии маршрута (`location.state`) нет информации, используется значение 
  по умолчанию (`/`), чтобы перенаправить пользователя на главную страницу после успешного входа.
*/
  const { from } = location.state || { from: { pathname: '/' } };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      loginUserThunk({ email: values.email, password: values.password })
    );
    navigate(from.pathname, { replace: true });
  };

  useEffect(() => {
    dispatch(clearErrors());
  }, []);

  return (
    <LoginUI
      errorText={error!}
      email={values.email}
      setEmail={(e) => handleChange('email', e)}
      password={values.password}
      setPassword={(e) => handleChange('password', e)}
      handleSubmit={handleSubmit}
    />
  );
};
