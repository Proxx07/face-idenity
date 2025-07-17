import { ref } from 'vue';

export const useFilter = () => {
  const limit = ref<number>(6);
  const page = ref<number>(1);

  return {
    limit,
    page,
  };
};
