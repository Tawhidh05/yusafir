import Button from './Button';
import Modal from './Modal';

export default function ConfirmModal({ open, title, message, confirmLabel = 'Delete', loading, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={title}
      footer={<><Button variant="outline" onClick={onClose}>Keep it</Button><Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button></>}>
      <p className="text-mute">{message}</p>
    </Modal>
  );
}
