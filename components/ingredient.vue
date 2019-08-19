<template>
  <div class="ingredient">
    <input type="text" v-model="content" @input="updateContent" />
    <span>{{ content }}</span>
    <button v-on:click="removeIngredient(ingredient)">-</button>
    <button v-on:click="addIngredientAfter(ingredient)">+</button>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      content: this.ingredient.content
    };
  },
  methods: {
    addIngredientAfter(ingredient) {
      this.$emit("add-ingredient-here", ingredient);
    },
    removeIngredient(ingredient) {
      this.$emit("remove-ingredient", ingredient);
    },
    updateContent(ingredient) {
      this.$emit("update:content", this.content);
    }
  },
  props: ["ingredient"]
};
</script>

<style lang="scss">
</style>
