import styles from '../styles/StyledButton.module.css'

const StyledButton = ({ children, ...rest }) => {
  return (
    <button
      className={styles.button}
      {...rest}
    >
      {children}
    </button>
  );
};

export default StyledButton;
