import styles from '../styles/CenterContainer.module.css'

const CenterContainer = ({
  flash = false,
  noBorder = false,
  greyBorder = false,
  children,
}) => {
  let classNames = [styles.container]

  if (!noBorder) {
    if (greyBorder) {
      classNames.push(styles.greyBorder)
    } else {
      // the default colored border, which can flash or not
      if (flash) {
        classNames.push(styles.flash)
      }
      classNames.push(styles.border)
    }
  }

  return (
    <div className={classNames.join(' ')}>
      {children}
    </div>
  );
};

export default CenterContainer;
