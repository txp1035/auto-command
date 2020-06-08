export const common = {
  scroll: {
    x: true,
  },
  bordered: true,
  rowKey: (record: any, index: any) => {
    const obj = {
      index,
      ...record,
    };
    const { id } = record;
    if (id) {
      return id;
    }
    return JSON.stringify(obj);
  },
};
