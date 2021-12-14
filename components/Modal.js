import styles from '../styles/Modal.module.css'

const Modal = ({ children, onClose }) => (
    <div className={styles.modal} onClick={onClose}>

        <div className={styles.content}>
            {children}
            <span className={styles.close} onClick={onClose}>&times;</span>
        </div>

    </div>
)

export default Modal;
