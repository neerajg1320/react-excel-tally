const bankMapperList = []

export const addMapper = (name, mapper) => {
  bankMapperList.push(
      {
        name,
        mapper
      }
  )
}

export const removeMapper = (name) => {
  const index = bankMapperList.findIndex(item => item.name === name);
  if (index) {
    bankMapperList.splice(index, 1);
  }
}

export const getMapperByName = (name) => {
  const index = bankMapperList.findIndex(item => item.name === name);
  if (index) {
    return bankMapperList[index];
  }

  return null;
}

export const getMappers = () => {
  return bankMapperList;
}
