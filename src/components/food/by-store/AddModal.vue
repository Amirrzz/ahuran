<template>
  <v-dialog
    :model-value="isOpenModal"
    max-width="600px"
    @after-leave="emitCloseModal"
  >
    <v-card>
      <v-card-title class="text-h6">Add New Food</v-card-title>

      <v-card-text>
        <div class="exapnded-row">
          <v-text-field
            v-model="newFood.Title"
            label="Title"
            placeholder="Title"
            variant="outlined"
            density="comfortable"
            hide-details
          />

          <v-text-field
            v-model="newFood.Description"
            label="Description"
            placeholder="Description"
            variant="outlined"
            density="comfortable"
            hide-details
          />

          <v-text-field
            v-model="newFood.Price"
            label="Price"
            placeholder="Price"
            variant="outlined"
            density="comfortable"
            hide-details
          />
          <v-text-field
            v-model="newFood.Image"
            hide-details
            label="Image"
            placeholder="Image"
            density="comfortable"
            variant="outlined"
            :maxlength="50"
          />

          <v-select
            :items="categories"
            v-model="newFood.Category"
            label="Category"
            placeholder="Select Category"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text
          color="grey"
          @click="emitCloseModal"
          :disabled="isLoading"
          :loading="isLoading"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          @click="submitNewFood"
          :disabled="isLoading"
          :loading="isLoading"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref } from "vue";
import { useFoodStore } from "@/store/foods.js";
const foodStore = useFoodStore();

defineProps({
  isOpenModal: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(["onClose", "onAddFood"]);

const newFood = ref({
  Title: "",
  Description: "",
  Price: 0,
  Category: "",
});
const isLoading = ref(false);
const submitNewFood = () => {
  newFood.value["Category"] = "Test";
  newFood.value["C_OR_R"] = "T";
  newFood.value["image"] = "";
  isLoading.value = true;
  foodStore
    .addFood(newFood.value)
    .then(() => {
      emits("onAddFood", newFood.value);
      newFood.value = {
        Title: "",
        Description: "",
        Price: 0,
        Category: "",
        image: "",
      };
      emitCloseModal();
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const emitCloseModal = () => {
  emits("onClose");
};
</script>
