<template>
  <v-card flat title="Foods">
    <template #text>
      <div class="d-flex align-center ga-4">
        <v-text-field
          v-model="search"
          hide-details
          label="Search"
          prepend-inner-icon="mdi-magnify"
          single-line
          variant="outlined"
          clearable
        />
        <v-btn color="primary" @click="isOpenAddModal = true">
          Add New Food
        </v-btn>
      </div>
    </template>

    <v-data-table
      :headers="computedTableHeaders"
      :items="computedFoodList"
      :search="search"
      :expanded="computedExpandedList"
      item-value="Id"
      :loading="isLoadingGettingList"
    >
      <template v-slot:item.actions="{ item, index }">
        <div
          class="d-flex ga-2 items-center justify-end"
          v-if="!computedExpandedList.includes(item.Id)"
        >
          <v-btn
            icon="mdi-pen"
            size="small"
            class="rounded"
            color="success"
            @click="handlerEdit(item, index)"
            :loading="item.isLoading"
          >
          </v-btn>
          <v-btn
            icon="mdi-delete"
            size="small"
            class="rounded"
            color="red"
            @click="handlerDelete(item, index)"
            :loading="item.isLoading"
          >
          </v-btn>
        </div>
        <div
          class="d-flex ga-2 items-center justify-end"
          v-if="computedExpandedList.includes(item.Id)"
        >
          <v-btn
            icon="mdi-close"
            size="small"
            class="rounded"
            color="gray"
            @click="handlerCancelEdit(item)"
            :loading="item.isLoading"
          >
          </v-btn>
          <v-btn
            icon="mdi-check"
            size="small"
            class="rounded"
            color="primary"
            @click="handlerApplyEdit(item)"
            :loading="item.isLoading"
          >
          </v-btn>
        </div>
      </template>
      <template v-slot:expanded-row="{ columns, item, index }">
        <tr v-if="clonedExpanedFoodList[index]">
          <td :colspan="columns.length">
            <div class="exapnded-row">
              <v-text-field
                v-model="clonedExpanedFoodList[index].Title"
                hide-details
                label="Title"
                placeholder="Title"
                variant="outlined"
                density="comfortable"
                :disabled="item.isLoading"
              />
              <v-text-field
                v-model="clonedExpanedFoodList[index].Description"
                hide-details
                label="Description"
                placeholder="Description"
                variant="outlined"
                density="comfortable"
                :disabled="item.isLoading"
              />
              <v-text-field
                v-model="clonedExpanedFoodList[index].Price"
                hide-details
                label="Price"
                placeholder="Price"
                density="comfortable"
                variant="outlined"
                :disabled="item.isLoading"
              />
              <v-text-field
                v-model="clonedExpanedFoodList[index].Image"
                hide-details
                label="Image"
                placeholder="Image"
                density="comfortable"
                variant="outlined"
                :maxlength="50"
                :disabled="item.isLoading"
              />
              <v-select
                :items="foodStore.getCategories || []"
                v-model="clonedExpanedFoodList[index].Category"
                density="comfortable"
                label="Comfortable"
                variant="outlined"
                :disabled="item.isLoading"
              ></v-select>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
  <AddModal
    :isOpenModal="isOpenAddModal"
    @onClose="isOpenAddModal = false"
    @onAddFood="handlerNewFood"
    :categories="foodStore.getCategories || []"
  />
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import TableHeaders from "@/utilities/table-headers/foods.json";
import { useFoodStore } from "@/store/foods.js";
import { useDisplay } from "vuetify";
import AddModal from "@/components/food/by-store/AddModal.vue";
const { smAndDown, md: mediumScreenSize } = useDisplay();
/// get and filtre food list parts

const foodStore = useFoodStore();
const search = ref("");
const computedFoodList = computed(() => {
  const list = foodStore.list || [];
  return list.map((food) => {
    return {
      ...food,
      Price: food?.Price?.toLocaleString() || 0,
    };
  });
});
const isLoadingGettingList = ref(false);
const getNewFoodList = async () => {
  isLoadingGettingList.value = true;
  foodStore.getFoodList().finally(() => {
    isLoadingGettingList.value = false;
  });
};
const computedTableHeaders = computed(() => {
  if (smAndDown.value) return TableHeaders.mobile;
  if (mediumScreenSize.value) return TableHeaders.tablet;
  return TableHeaders.desktop;
});
/// helpers
const getFoodIndexById = (foodId) => {
  return computedFoodList.value.findIndex(
    (foodItem) => foodItem?.Id === foodId
  );
};

/// add parts
const isOpenAddModal = ref(false);
/// edit parts
const computedExpandedList = computed(() => {
  return clonedExpanedFoodList.value.map((food) => food.Id);
});
const clonedExpanedFoodList = ref([]);

const handlerEdit = (food, index) => {
  const clonedFood = JSON.parse(JSON.stringify(food));
  clonedExpanedFoodList.value[index] = clonedFood;
};

const handlerCancelEdit = (food) => {
  const targetExapndedIndex = clonedExpanedFoodList.value.findIndex(
    (foodItem) => foodItem?.Id === food.Id
  );
  if (targetExapndedIndex > -1) {
    clonedExpanedFoodList.value[targetExapndedIndex] = {};
  }
};

const handlerApplyEdit = (item) => {
  const targetClonedFoodIndex = clonedExpanedFoodList.value.findIndex(
    (foodItem) => foodItem?.Id === item.Id
  );
  if (targetClonedFoodIndex === -1) return;
  const targetClonedFood = clonedExpanedFoodList.value[targetClonedFoodIndex];
  const targetFoodIndex = getFoodIndexById(targetClonedFood.Id);
  targetClonedFood["C_OR_R"] = "T";
  targetClonedFood["Category"] = "test";
  targetClonedFood["Price"] = +(
    targetClonedFood?.Price?.replaceAll(",", "") || 0
  );
  foodStore.updateFood(targetClonedFood, targetFoodIndex).then(() => {
    handlerCancelEdit(targetClonedFood);
  });
};
const handlerNewFood = () => {
  clonedExpanedFoodList.value = [];
};
/// delete part
const handlerDelete = (food, index) => {
  foodStore.deleteFood(food, index);
};
onBeforeMount(() => {
  getNewFoodList();
});
</script>

<style scoped:deep>
.exapnded-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
  padding: 10px 0;
  max-width: 500px;
  justify-content: center;
  margin: 0 auto;
}
</style>
