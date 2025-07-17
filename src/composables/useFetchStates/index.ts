import { ref, watch } from 'vue';

export const useFetchStates = () => {
  const loading = ref<boolean>(false);

  const sending = ref<boolean>(false);
  const sended = ref<boolean>(false);

  const deleting = ref<boolean>(false);
  const deleted = ref<boolean>(false);

  watch(sended, async (value) => {
    if (!value) return;
    await new Promise(resolve => setTimeout(resolve, 1500));
    sended.value = false;
  });

  watch(deleted, async (value) => {
    if (!value) return;
    await new Promise(resolve => setTimeout(resolve, 1500));
    deleted.value = false;
  });

  return {
    loading,
    sending,
    sended,
    deleting,
    deleted,
  };
};
