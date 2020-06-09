
import { useState } from 'react';

export  function useExpanded(expandedRowRender: any) {
  const [expandedRowKeys, setExpandedRowKeys]: any = useState([]);
  const expanded = {
    expandedRowKeys,
    onExpandedRowsChange: (keys: any) => {
      if (keys.length > 1) {
        // 在其他展开情况下点击加号
        setExpandedRowKeys([keys.pop()]);
      } else {
        // 点击减号、加号
        setExpandedRowKeys(keys);
      }
    },
    expandedRowRender,
  };
  return expanded;
}

export function common(columns){
  const width = columns.map(item => item.width || 100).reduce((pre, next) => pre + next);
  return {
    scroll: {
      x: width,
    },
    bordered: true,
    rowKey: (record: any, index: any) => {
      const obj = {
        index, // 防止后端返回一样的数据
        ...record,
      };
      const { id } = record;
      if (id) {
        return id;
      }
      return JSON.stringify(obj);
    },
  };
};
