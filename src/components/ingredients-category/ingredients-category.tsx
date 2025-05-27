import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { selectBurgerBuilder } from '../../services/slices/constructorSlice/constructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const state = useSelector(selectBurgerBuilder).selectedItems;

  const countById = useMemo(() => {
    const { bun, fillings } = state;
    const map: { [key: string]: number } = {};
    ingredients.forEach((item: TIngredient) => {
      if (!map[item._id]) map[item._id] = 0;
      map[item._id]++;
    });
    if (bun) map[bun._id] = 2;
    return map;
  }, [state]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={countById}
      ref={ref}
    />
  );
});
