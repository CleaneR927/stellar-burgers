import { useState } from 'react';

interface IInitialValues {
  [key: string]: string;
}
// Хук позволяет удобно отслеживать значения входных полей и обновлять их
export function useForm(initialValues: IInitialValues) {
  const [values, setValues] = useState<IInitialValues>(initialValues);
  // Принимает название поля, которое нужно обновить и новое значение для поля, либо функцию, которая принимает текущее значение и возвращает новое.
  const handleChange = (
    name: keyof IInitialValues,
    value: string | ((prevValue: string) => string)
  ) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: typeof value === 'function' ? value(prevValues[name]) : value
    }));
  };

  return { values, handleChange };
}
