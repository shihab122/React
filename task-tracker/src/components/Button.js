import PropTypes from "prop-types";

const Button = ({ text, color, onClick }) => {
  return (
    <button
      style={{ backgroundColor: color }}
      className="btn"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

Button.defaultProps = {
  text: "Add",
  color: "steelblue",
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
