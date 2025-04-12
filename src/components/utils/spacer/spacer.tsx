const Spacer = ({ size = 16, axis = "vertical", style = {} }) => {
  const width = axis === "horizontal" ? size : 0;
  const height = axis === "vertical" ? size : 0;

  return (
    <div
      style={{
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
        minWidth: width ? `${width}px` : "auto",
        minHeight: height ? `${height}px` : "auto",
        ...style,
      }}
    />
  );
};

export default Spacer;
