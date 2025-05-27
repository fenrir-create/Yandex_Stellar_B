import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id: ingredientId } = useParams<{ id: string }>();

  // Получаем список ингредиентов из стора
  const allIngredients: TIngredient[] = useSelector(
    (state) => state.ingredient.ingredients
  );

  // Находим нужный ингредиент по id
  const selectedIngredient = allIngredients.find(
    (item) => item._id === ingredientId
  );

  if (!selectedIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};
