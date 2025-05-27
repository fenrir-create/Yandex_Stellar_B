import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchUser,
  updateProfile,
  selectAuthState
} from '../../services/slices/userSlice/userSlice';
import { Preloader } from '@ui';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const { currentUser, isLoading } = useSelector((state) => state.user);

  const user = {
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  };

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchUser());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    setFormValue((prev) => ({
      ...prev,
      name: user.name,
      email: user.email
    }));
  }, [user.name, user.email]);

  const isFormChanged =
    formValue.name !== user.name ||
    formValue.email !== user.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateProfile(formValue));
    dispatch(fetchUser()); // обновим данные
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
