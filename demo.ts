// 浅拷贝
const shallowClone = (source) => {
  const result = {};
  Object.keys(source).forEach((key) => {
    const value = source[key];
    result[key] = value;
  });
  return result;
};

// 深拷贝
const cloneJSON = (source) => {
  return JSON.parse(JSON.stringify(source));
};

const isObject = (source) => {
  return Object.prototype.toString.call(source) === "[object Object]";
};

const isArray = (source) => {
  return Object.prototype.toString.call(source) === "[object Array]";
};

const isClone = (source) => {
  // 仅对对象和数组进行深拷贝，其他类型直接返回
  return isObject(source) || isArray(source);
};

const deepClone = (source) => {
  // 校验参数，仅对对象和数组进行深拷贝，其他类型直接返回
  if (!isClone(source)) {
    return source;
  }

  // 保存深拷贝的结果
  // 增加引用类型的数据是数组的判断
  const result = isArray ? [] : {};

  // 遍历对象属性
  Object.keys(source).forEach((key) => {
    const value = source[key];
    // 递归
    result[key] = deepClone(value);
  });

  return result;
};

const cloneLoop = (source) => {
  // 初始化根结点
  let root = source;
  if (isArray(source)) {
    root = [];
  } else if (isObject(source)) {
    root = {};
  }

  // 缓存
  let uniqueData = new WeakMap();

  // 一个栈，存储下一个需要拷贝的节点
  const stack = [
    {
      parent: root,
      key: undefined,
      data: source,
    },
  ];
  // 栈空的时候拷贝结束
  while (stack.length) {
    // 出栈
    const node = stack.pop();
    const { parent, key, data } = node;

    // 初始化
    let target = parent;
    if (key !== undefined) {
      parent[key] = isArray(data) ? [] : {};
      target = parent[key];
    }

    // 解决循环引用
    if (isClone(data)) {
      let uniqueTarget = uniqueData.get(data);
      if (uniqueTarget) {
        // 命中缓存，直接返回缓存数据
        parent[key] = uniqueTarget;
        continue;
      }
      // 未命中缓存，保存到缓存
      uniqueData.set(data, target);
    }

    if (isClone(data)) {
      Object.keys(data).forEach((k) => {
        if (isClone(data[k])) {
          // 入栈
          stack.push({
            parent: target,
            key: k,
            data: data[k],
          });
        } else {
          target[k] = data[k];
        }
      });
    }
  }
  return root;
};
const test = { a: 1, b: 2, c: { d: { e: 3 } }, e: {} };
test.e = test;
console.log(cloneLoop(test));
