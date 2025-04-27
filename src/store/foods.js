import { defineStore } from 'pinia';
import { getFoodList, updateFood, deleteFood, addFood } from "@/api/foods/index.js";

export const useFoodStore = defineStore('FoodStore', {
    state: () => ({
        list: []
    }),
    getters: {
        getCategories(state) {
            const categories = state.list
                .map((food) => food.Category?.trim())
                .filter((food) => food);
            return [...new Set(categories)];
        }
    },
    actions: {
        getFoodList() {
            return getFoodList().then((result) => {
                this.list = result
            })
        },
        updateFood(food, index) {
            this.list[index].isLoading = true
            return updateFood(food).then(() => {
                this.updateExistFoodLocally(food, index)
            }).finally(() => {
                this.list[index].isLoading = false
            })
        },
        deleteFood(food, index) {
            this.list[index].isLoading = true
            return deleteFood(food)
                .then(() => {
                    this.list.splice(index, 1);
                })
                .finally(() => {
                    this.list[index].isLoading = false;
                });
        },
        addFood(newFood) {
            return addFood(newFood)
                .then(() => {
                    this.list.unshift(newFood);
                })
        },
        updateExistFoodLocally(food, index) {
            this.list[index] = food

        }
    },
    persist: [
        {
            paths: ['list'],
        },
    ],
});