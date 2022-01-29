export const FilterCheckBox = ({ name, filterAdd, filterRemove }) => {
  return (
    <label>
      {name}
      <input
        type="checkbox"
        onInput={(e) => {
          e.target.checked
            ? filterAdd(name.toLowerCase())
            : filterRemove(name.toLowerCase());
        }}
      />
    </label>
  );
};
