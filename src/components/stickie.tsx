import React from "react";

const Stickie = () => {
  const [contentedit, setcontentedit] = React.useState<boolean>(false);

  function togglecontentedit() {
    setcontentedit((prev) => !prev);
  }

  function handleBlur() {
    setcontentedit(false); // Locks editing when clicking away
  }

  return (
    <div
      className="stickie"
      contentEditable={contentedit}
      onDoubleClick={togglecontentedit}
      onBlur={handleBlur} // Fires when the user clicks outside
      suppressContentEditableWarning
      style={{ cursor: contentedit === false ? "grab" : "text" }}
    >
      stickie
    </div>
  );
};

export default Stickie;
